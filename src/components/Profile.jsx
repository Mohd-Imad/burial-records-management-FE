import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { Card, CardHeader, CardTitle, CardContent, FormGroup, Button } from '../styles/CommonStyles';
import axios from '../utils/axios';
import { useToast } from '../contexts/ToastContext';
import { MdCameraAlt, MdArrowBack } from 'react-icons/md';

const ProfileContainer = styled.div`
  max-width: 800px;

  h1 {
    body.dark-theme & {
      color: #e5e5e5;
    }
  }
`;

const ProfileCard = styled(Card)`
  margin-bottom: 24px;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
`;

const AvatarContainer = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${props => props.$hasImage ? 'transparent' : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: 700;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
  overflow: hidden;
  border: 4px solid white;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UploadButton = styled.label`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #6366f1;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.2s;
  
  &:hover {
    background: #4f46e5;
    transform: scale(1.1);
  }
  
  input {
    display: none;
  }
`;

const ProfileInfo = styled.div`
  flex: 1;

  h2 {
    margin: 0 0 8px 0;
    font-size: 24px;
    font-weight: 700;
    color: ${theme.colors.gray900};

    body.dark-theme & {
      color: #e5e5e5;
    }
  }

  p {
    margin: 0 0 4px 0;
    color: ${theme.colors.gray600};
    font-size: 14px;

    body.dark-theme & {
      color: #b0b0b0;
    }
  }

  .role-badge {
    display: inline-block;
    margin-top: 8px;
    padding: 6px 12px;
    background: #6366f1;
    color: white;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;

    body.dark-theme & {
      background: #7c3aed;
    }
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;

  body.dark-theme & {
    h1 {
      color: #e5e5e5;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

function Profile() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    phone: '',
    bio: '',
    role: '',
    profileImage: null
  });
  const [uploading, setUploading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/profile');
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      showToast('Failed to load profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5000000) {
      showToast('Image size should be less than 5MB', 'error');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file', 'error');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('profileImage', file);

      const response = await axios.put('/api/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setProfile(response.data.user);
      showToast('Profile image updated successfully', 'success');
    } catch (error) {
      console.error('Error uploading image:', error);
      showToast('Failed to upload image', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const response = await axios.put('/api/profile', profile);
      setProfile(response.data.user);
      showToast('Profile updated successfully', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast(error.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    try {
      setSaving(true);
      const response = await axios.put('/api/profile', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      showToast('Password updated successfully', 'success');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error updating password:', error);
      showToast(error.response?.data?.message || 'Failed to update password', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ProfileContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>My Profile</h1>
        <Button $variant="secondary" onClick={() => navigate(-1)}>
          <MdArrowBack size={18} /> Back
        </Button>
      </div>

      <ProfileCard>
        <ProfileHeader>
          <AvatarContainer>
            <Avatar $hasImage={!!profile.profileImage}>
              {profile.profileImage ? (
                <img src={profile.profileImage} alt={profile.username} />
              ) : (
                profile.username?.charAt(0).toUpperCase()
              )}
            </Avatar>
            <UploadButton>
              <MdCameraAlt size={20} />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </UploadButton>
          </AvatarContainer>
          <ProfileInfo>
            <h2>{profile.username}</h2>
            <p>{profile.email}</p>
            <span className="role-badge">{profile.role}</span>
          </ProfileInfo>
        </ProfileHeader>
      </ProfileCard>

      <ProfileCard>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit}>
            <FormRow>
              <FormGroup>
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={profile.username}
                  onChange={handleProfileChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  required
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <label>Phone (Optional)</label>
              <input
                type="tel"
                name="phone"
                value={profile.phone || ''}
                onChange={handleProfileChange}
                placeholder="+254 700 000 000"
              />
            </FormGroup>

            <FormGroup>
              <label>Bio (Optional)</label>
              <textarea
                name="bio"
                value={profile.bio || ''}
                onChange={handleProfileChange}
                placeholder="Tell us about yourself..."
                rows="4"
              />
            </FormGroup>

            <ButtonGroup>
              <Button type="submit" $variant="primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button type="button" $variant="secondary" onClick={fetchProfile}>
                Cancel
              </Button>
            </ButtonGroup>
          </form>
        </CardContent>
      </ProfileCard>

      <ProfileCard>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit}>
            <FormGroup>
              <label>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </FormGroup>

            <FormRow>
              <FormGroup>
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="6"
                />
              </FormGroup>

              <FormGroup>
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="6"
                />
              </FormGroup>
            </FormRow>

            <ButtonGroup>
              <Button type="submit" $variant="primary" disabled={saving}>
                {saving ? 'Updating...' : 'Update Password'}
              </Button>
            </ButtonGroup>
          </form>
        </CardContent>
      </ProfileCard>
    </ProfileContainer>
  );
}

export default Profile;
