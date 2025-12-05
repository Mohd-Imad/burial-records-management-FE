import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { Card, Button, FormGroup, FormGrid, PageHeader } from '../styles/CommonStyles';
import { theme } from '../styles/theme';
import ModernDatePicker from './ModernDatePicker';
import { useToast } from '../contexts/ToastContext';
import { useSettings } from '../contexts/SettingsContext';
import { MdArrowBack, MdSave, MdAssignment, MdPerson, MdAttachFile, MdInfoOutline, MdFolder, MdCheckCircle, MdSchedule, MdVerified, MdRefresh } from 'react-icons/md';
import { InlineSpinner } from './Spinner';
import Tooltip from './Tooltip';

const SectionTitle = styled.h3`
  margin-top: ${props => props.$first ? '0' : theme.spacing.xl};
  margin-bottom: ${theme.spacing.lg};
  color: ${theme.colors.textPrimary};
  font-size: ${theme.fontSizes.xl};
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding-bottom: ${theme.spacing.sm};
  border-bottom: 2px solid ${theme.colors.gray200};

  body.dark-theme & {
    color: #e5e5e5;
    border-bottom-color: #3d3d3d;
  }

  span {
    font-size: 24px;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.lg};
  flex-wrap: wrap;

  label {
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    border: 2px solid ${theme.colors.gray200};
    border-radius: ${theme.borderRadius.lg};
    cursor: pointer;
    transition: all ${theme.transitions.base};
    font-weight: 500;
    background: white;

    body.dark-theme & {
      background: #2d2d2d;
      border-color: #3d3d3d;
      color: #e5e5e5;
    }

    input {
      width: auto;
      margin: 0;
      cursor: pointer;
    }

    &:hover {
      border-color: ${theme.colors.primarySolid};
      background: linear-gradient(135deg, #fafbff 0%, #ffffff 100%);

      body.dark-theme & {
        background: #353535;
        border-color: #7c3aed;
      }
    }

    input:checked + & {
      border-color: ${theme.colors.primarySolid};
      background: linear-gradient(135deg, #f0f4ff 0%, #e8eeff 100%);

      body.dark-theme & {
        background: #3d2d5d;
        border-color: #7c3aed;
      }
    }
  }
`;

const FileUploadArea = styled.div`
  border: 3px dashed ${theme.colors.gray300};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.xl};
  text-align: center;
  transition: all ${theme.transitions.base};
  background: ${theme.colors.gray50};
  cursor: pointer;

  body.dark-theme & {
    background: #2d2d2d;
    border-color: #3d3d3d;
  }

  &:hover {
    border-color: ${theme.colors.primarySolid};
    background: linear-gradient(135deg, #fafbff 0%, #ffffff 100%);

    body.dark-theme & {
      background: #353535;
      border-color: #7c3aed;
    }
  }

  .icon {
    font-size: 48px;
    margin-bottom: ${theme.spacing.md};
  }

  p {
    color: ${theme.colors.gray600};
    font-size: ${theme.fontSizes.sm};
    margin: ${theme.spacing.sm} 0;

    body.dark-theme & {
      color: #b0b0b0;
    }
  }

  input[type="file"] {
    display: none;
  }
`;

const FileInfo = styled.div`
  margin-top: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  border-radius: ${theme.borderRadius.lg};
  color: ${theme.colors.success};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};

  body.dark-theme & {
    background: linear-gradient(135deg, #064e3b 0%, #065f46 100%);
    color: #6ee7b7;
  }

  svg {
    margin-right: 8px;
  }
`;

const InfoIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: ${theme.spacing.xs};
  color: #6b7280;
  cursor: help;
  transition: all ${theme.transitions.base};
  opacity: 0.7;

  body.dark-theme & {
    color: #9ca3af;
  }

  &:hover {
    color: #3b82f6;
    opacity: 1;
    transform: scale(1.15);

    body.dark-theme & {
      color: #60a5fa;
    }
  }
`;

const HelperText = styled.p`
  margin-top: 6px;
  font-size: 12px;
  color: #6b7280;
  line-height: 1.4;
  display: flex;
  align-items: center;

  body.dark-theme & {
    color: #9ca3af;
  }

  svg {
    flex-shrink: 0;
  }
`;

const SubmitSection = styled.div`
  margin-top: ${theme.spacing['2xl']};
  padding-top: ${theme.spacing.xl};
  border-top: 2px solid ${theme.colors.gray200};
  display: flex;
  gap: ${theme.spacing.md};
  align-items: center;

  body.dark-theme & {
    border-top-color: #3d3d3d;
  }
`;

const AutoSaveIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: ${theme.colors.gray500};
  margin-left: auto;

  body.dark-theme & {
    color: #a0a0a0;
  }

  &.saving {
    color: ${theme.colors.warning};
  }

  &.saved {
    color: ${theme.colors.success};
  }

  svg {
    animation: ${props => props.$saving ? 'spin 1s linear infinite' : 'none'};
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

function DataCapture() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editId = searchParams.get('edit');
  const { success, error } = useToast();
  const { settings } = useSettings();

  const [formData, setFormData] = useState({
    permitNumber: '',
    firstName: '',
    middleName: '',
    lastName: '',
    idPassportNo: '',
    gender: 'Male',
    age: '',
    dateOfDeath: '',
    nextOfKinName: '',
    nextOfKinContact: '',
    nextOfKinIdPassport: '',
    burialLocation: 'Block A',
    primaryService: 'Burial',
    amountPaidBurial: '',
    secondaryService: 'None',
    amountPaidSecondary: '',
    tertiaryService: 'None',
    amountPaidTertiary: '',
    mpesaRefNo: '',
    receiptNo: '',
    status: 'Pending'
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState(''); // '', 'saving', 'saved';

  // Load draft from localStorage on mount (only for new permits and if auto-save is enabled)
  useEffect(() => {
    if (!editId) {
      if (settings.autoSave) {
        const savedDraft = localStorage.getItem('permitDraft');
        if (savedDraft) {
          try {
            const draft = JSON.parse(savedDraft);
            setFormData(draft);
            success('Draft restored from previous session');
          } catch (err) {
            console.error('Error loading draft:', err);
          }
        }
      }
      generatePermitNumberPreview();
    } else {
      fetchPermitData(editId);
    }
  }, [editId, settings.autoSave]);

  // Auto-save to localStorage when form data changes
  useEffect(() => {
    if (!editId && settings.autoSave && (formData.firstName || formData.lastName)) {
      setAutoSaveStatus('saving');

      const timer = setTimeout(() => {
        try {
          localStorage.setItem('permitDraft', JSON.stringify(formData));
          setAutoSaveStatus('saved');

          // Clear saved status after 2 seconds
          setTimeout(() => setAutoSaveStatus(''), 2000);
        } catch (err) {
          console.error('Error saving draft:', err);
          setAutoSaveStatus('');
        }
      }, 1500); // Save after 1.5 seconds of no typing

      return () => clearTimeout(timer);
    }
  }, [formData, editId, settings.autoSave]);

  const generatePermitNumberPreview = async () => {
    const token = localStorage.getItem('token');
    try {
      const year = new Date().getFullYear();

      // Get all permits for the current year to find the highest number
      const response = await axios.get('/api/permits', {
        headers: { 'x-auth-token': token },
        params: {
          search: `BP-${year}`,
          limit: 1000 // Get all permits for current year
        }
      });

      let nextNumber = 1;
      if (response.data.permits && response.data.permits.length > 0) {
        // Find the highest permit number
        const permitNumbers = response.data.permits
          .map(p => {
            const match = p.permitNumber?.match(/BP-\d{4}-(\d{5})/);
            return match ? parseInt(match[1]) : 0;
          })
          .filter(n => n > 0);

        if (permitNumbers.length > 0) {
          nextNumber = Math.max(...permitNumbers) + 1;
        }
      }

      const paddedNumber = String(nextNumber).padStart(5, '0');
      setFormData(prev => ({ ...prev, permitNumber: `BP-${year}-${paddedNumber}` }));
    } catch (err) {
      console.error('Error generating permit number:', err);
    }
  };

  const fetchPermitData = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`/api/permits/${id}`, {
        headers: { 'x-auth-token': token }
      });
      const permit = res.data;
      setFormData({
        permitNumber: permit.permitNumber || '',
        firstName: permit.firstName || '',
        middleName: permit.middleName || '',
        lastName: permit.lastName || '',
        idPassportNo: permit.idPassportNo || '',
        gender: permit.gender || 'Male',
        age: permit.age || '',
        dateOfDeath: permit.dateOfDeath ? permit.dateOfDeath.split('T')[0] : '',
        nextOfKinName: permit.nextOfKinName || '',
        nextOfKinContact: permit.nextOfKinContact || '',
        nextOfKinIdPassport: permit.nextOfKinIdPassport || '',
        burialLocation: permit.burialLocation || 'Block A',
        primaryService: permit.primaryService || 'Burial',
        amountPaidBurial: permit.amountPaidBurial || '',
        secondaryService: permit.secondaryService || 'None',
        amountPaidSecondary: permit.amountPaidSecondary || '',
        tertiaryService: permit.tertiaryService || 'None',
        amountPaidTertiary: permit.amountPaidTertiary || '',
        mpesaRefNo: permit.mpesaRefNo || '',
        receiptNo: permit.receiptNo || '',
        status: permit.status || 'Pending'
      });
    } catch (err) {
      setMessage('Error loading permit data');
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate Date of Death is not in the future
    if (formData.dateOfDeath) {
      const dod = new Date(formData.dateOfDeath);
      const today = new Date();
      today.setHours(23, 59, 59, 999);

      if (dod > today) {
        error('Date of Death cannot be in the future');
        return;
      }
    }

    // Validate Date of Death is not in the future
    if (formData.dateOfDeath) {
      const dod = new Date(formData.dateOfDeath);
      const today = new Date();
      today.setHours(23, 59, 59, 999);

      if (dod > today) {
        error('Date of Death cannot be in the future');
        return;
      }
    }

    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    files.forEach(file => data.append('attachments', file));

    try {
      const token = localStorage.getItem('token');

      if (editId) {
        // Update existing permit
        await axios.put(`/api/permits/${editId}`, formData, {
          headers: { 'x-auth-token': token }
        });
        success('Permit record updated successfully!');
      } else {
        // Create new permit
        const res = await axios.post('/api/permits', data, {
          headers: {
            'x-auth-token': token,
            'Content-Type': 'multipart/form-data'
          }
        });
        success(`Permit ${res.data.permitNumber} created successfully!`);
        // Clear draft from localStorage after successful submission
        localStorage.removeItem('permitDraft');
        setFormData({
          permitNumber: '',
          firstName: '',
          middleName: '',
          lastName: '',
          idPassportNo: '',
          gender: 'Male',
          age: '',
          dateOfDeath: '',
          nextOfKinName: '',
          nextOfKinContact: '',
          nextOfKinIdPassport: '',
          burialLocation: 'Block A',
          primaryService: 'Burial',
          amountPaidBurial: '',
          secondaryService: 'None',
          amountPaidSecondary: '',
          tertiaryService: 'None',
          amountPaidTertiary: '',
          mpesaRefNo: '',
          receiptNo: '',
          status: 'Pending'
        });
        setFiles([]);
        setAutoSaveStatus('');
        generatePermitNumberPreview();
      }
    } catch (err) {
      error(err.response?.data?.msg || 'Error saving record');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    // Clear draft from localStorage
    localStorage.removeItem('permitDraft');
    setFormData({
      permitNumber: '',
      firstName: '',
      middleName: '',
      lastName: '',
      idPassportNo: '',
      gender: 'Male',
      age: '',
      dateOfDeath: '',
      nextOfKinName: '',
      nextOfKinContact: '',
      nextOfKinIdPassport: '',
      burialLocation: 'Block A',
      primaryService: 'Burial',
      amountPaidBurial: '',
      secondaryService: 'None',
      amountPaidSecondary: '',
      tertiaryService: 'None',
      amountPaidTertiary: '',
      mpesaRefNo: '',
      receiptNo: '',
      status: 'Pending'
    });
    setFiles([]);
    setAutoSaveStatus('');
    generatePermitNumberPreview();
  };

  return (
    <div>
      <PageHeader>
        <div>
          <h1>New Permit</h1>
          <p>Create and register a new burial permit</p>
        </div>
        {editId && (
          <Button $variant="secondary" onClick={() => navigate('/records')}>
            <MdArrowBack size={18} /> Back to Records
          </Button>
        )}
      </PageHeader>

      <Card>
        <form onSubmit={handleSubmit}>
          <SectionTitle $first>
            <span className="section-icon"><MdAssignment /></span>
            Burial Permit No.
          </SectionTitle>
          <FormGrid>
            <FormGroup>
              <label>Permit Number *</label>
              <input
                name="permitNumber"
                value={formData.permitNumber}
                readOnly
                placeholder="Auto-generated"
                required
                style={{ fontWeight: 600, fontSize: '16px', color: '#667eea' }}
              />
            </FormGroup>
          </FormGrid>

          <SectionTitle>
            <span className="section-icon"><MdPerson /></span>
            Deceased Information
          </SectionTitle>
          <FormGrid>
            <FormGroup>
              <label>First Name *</label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                required
              />
            </FormGroup>
            <FormGroup>
              <label>Middle Name</label>
              <input
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                placeholder="Enter middle name"
              />
            </FormGroup>
            <FormGroup>
              <label>Last Name *</label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                required
              />
            </FormGroup>
            <FormGroup>
              <label>ID / Passport No</label>
              <input
                name="idPassportNo"
                value={formData.idPassportNo}
                onChange={handleChange}
                placeholder="Enter ID or Passport number"
              />
            </FormGroup>
            <FormGroup>
              <label>Gender *</label>
              <select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </FormGroup>
            <FormGroup>
              <label>Age *</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter age"
                required
              />
            </FormGroup>
            <FormGroup>
              <label>Date of Death *</label>
              <ModernDatePicker
                value={formData.dateOfDeath}
                onChange={handleChange}
                name="dateOfDeath"
                placeholder="Pick date of death"
                maxDate={new Date()}
                required
              />
              <HelperText>
                <MdInfoOutline size={14} style={{ marginRight: '4px' }} />
                Future dates cannot be selected
              </HelperText>
            </FormGroup>
          </FormGrid>

          <SectionTitle>
            <span className="section-icon"><MdPerson /></span>
            Next of Kin Information
            <Tooltip
              content="Closest relative to contact in emergency (spouse, parent, sibling, or adult child)"
              position="right"
              multiline={true}
              width="400px"
            >
              <InfoIcon>
                <MdInfoOutline size={18} />
              </InfoIcon>
            </Tooltip>
          </SectionTitle>
          <FormGrid>
            <FormGroup>
              <label>Name of Next of Kin *</label>
              <input
                name="nextOfKinName"
                value={formData.nextOfKinName}
                onChange={handleChange}
                placeholder="Enter next of kin name"
                required
              />
            </FormGroup>
            <FormGroup>
              <label>Next of Kin Contact *</label>
              <input
                type="tel"
                name="nextOfKinContact"
                value={formData.nextOfKinContact}
                onChange={handleChange}
                placeholder="e.g., 0712345678"
                required
              />
            </FormGroup>
            <FormGroup>
              <label>Next of Kin ID / Passport No</label>
              <input
                name="nextOfKinIdPassport"
                value={formData.nextOfKinIdPassport}
                onChange={handleChange}
                placeholder="Enter ID or Passport number"
              />
            </FormGroup>
          </FormGrid>

          <SectionTitle>
            <span className="section-icon"><MdAttachFile /></span>
            Burial Location & Services
          </SectionTitle>
          <FormGrid>
            <FormGroup>
              <label>Location of Burial *</label>
              <select name="burialLocation" value={formData.burialLocation} onChange={handleChange} required>
                <option value="Block A">Block A</option>
                <option value="Main">Main</option>
                <option value="Block B">Block B</option>
                <option value="Lan'gata">Lan'gata</option>
              </select>
            </FormGroup>
            <FormGroup>
              <label>Primary Service</label>
              <input
                name="primaryService"
                value={formData.primaryService}
                onChange={handleChange}
                placeholder="Burial"
                readOnly
              />
            </FormGroup>
            <FormGroup>
              <label>Amount Paid for Burial</label>
              <input
                type="number"
                name="amountPaidBurial"
                value={formData.amountPaidBurial}
                onChange={handleChange}
                placeholder="Enter amount"
                min="0"
              />
            </FormGroup>
            <FormGroup>
              <label>Secondary Service</label>
              <select name="secondaryService" value={formData.secondaryService} onChange={handleChange}>
                <option value="None">None</option>
                <option value="Head stone">Head stone</option>
                <option value="Permanent grave">Permanent grave</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </FormGroup>
            <FormGroup>
              <label>Amount Paid for Secondary Service</label>
              <input
                type="number"
                name="amountPaidSecondary"
                value={formData.amountPaidSecondary}
                onChange={handleChange}
                placeholder="Enter amount"
                min="0"
              />
            </FormGroup>
            <FormGroup>
              <label>Other Services</label>
              <select name="tertiaryService" value={formData.tertiaryService} onChange={handleChange}>
                <option value="None">None</option>
                <option value="Burial Permit application">Burial Permit application</option>
                <option value="Donation">Donation</option>
                <option value="Others">Others</option>
              </select>
            </FormGroup>
            <FormGroup>
              <label>Amount Paid for Other Services</label>
              <input
                type="number"
                name="amountPaidTertiary"
                value={formData.amountPaidTertiary}
                onChange={handleChange}
                placeholder="Enter amount"
                min="0"
              />
            </FormGroup>
          </FormGrid>

          <SectionTitle>
            <span className="section-icon"><MdAttachFile /></span>
            Payment Information
          </SectionTitle>
          <FormGrid>
            <FormGroup>
              <label>
                Mpesa Ref No.
                <Tooltip
                  content="M-Pesa is a mobile money service used mainly in Kenya and Tanzania that allows people to send, receive, and pay using their phones without a bank account."
                  position="right"
                  multiline={true}
                  width="450px"
                >
                  <InfoIcon>
                    <MdInfoOutline size={18} />
                  </InfoIcon>
                </Tooltip>
              </label>
              <input
                name="mpesaRefNo"
                value={formData.mpesaRefNo}
                onChange={handleChange}
                placeholder="Enter M-Pesa reference number"
              />
            </FormGroup>
            <FormGroup>
              <label>Receipt No.</label>
              <input
                name="receiptNo"
                value={formData.receiptNo}
                onChange={handleChange}
                placeholder="Enter receipt number"
              />
            </FormGroup>
          </FormGrid>

          <SectionTitle>
            <span className="section-icon"><MdAttachFile /></span>
            Attachments
          </SectionTitle>
          <FormGroup>
            <FileUploadArea onClick={() => document.getElementById('fileInput').click()}>
              <div className="icon"><MdFolder size={48} /></div>
              <p><strong>Click to upload</strong> or drag and drop</p>
              <p>PDF, JPG, PNG (Max 10MB)</p>
              <input
                id="fileInput"
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
            </FileUploadArea>
            {files.length > 0 && (
              <FileInfo>
                {files.length} file(s) selected
              </FileInfo>
            )}
          </FormGroup>

          <SectionTitle>
            <span className="section-icon"><MdCheckCircle /></span>
            Status
          </SectionTitle>
          <FormGroup>
            <RadioGroup>
              <label>
                <input
                  type="radio"
                  name="status"
                  value="Pending"
                  checked={formData.status === 'Pending'}
                  onChange={handleChange}
                />
                <MdSchedule size={18} /> Pending
              </label>
              <label>
                <input
                  type="radio"
                  name="status"
                  value="Completed"
                  checked={formData.status === 'Completed'}
                  onChange={handleChange}
                />
                <MdCheckCircle size={18} /> Completed
              </label>
              <label>
                <input
                  type="radio"
                  name="status"
                  value="Verified"
                  checked={formData.status === 'Verified'}
                  onChange={handleChange}
                />
                <MdVerified size={18} /> Verified
              </label>
            </RadioGroup>
          </FormGroup>

          <SubmitSection>
            <Button $variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <InlineSpinner size="16px" thickness="2px" /> Saving...
                </>
              ) : (
                <>
                  <MdSave size={18} /> Save Record
                </>
              )}
            </Button>
            <Button $variant="secondary" type="button" onClick={handleReset}>
              <MdRefresh size={18} /> Reset Form
            </Button>

            {!editId && settings.autoSave && (
              <AutoSaveIndicator
                className={autoSaveStatus}
                $saving={autoSaveStatus === 'saving'}
              >
                <MdSave size={16} />
                {autoSaveStatus === 'saving' && 'Saving draft...'}
                {autoSaveStatus === 'saved' && 'Draft saved'}
                {!autoSaveStatus && 'Auto-save enabled'}
              </AutoSaveIndicator>
            )}
          </SubmitSection>
        </form>
      </Card>
    </div>
  );
}

export default DataCapture;
