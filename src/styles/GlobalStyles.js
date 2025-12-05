import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

const GlobalStyles = createGlobalStyle`
  /* Import Inter font from Google Fonts */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: ${theme.fonts.body};
    background: ${theme.colors.gray50};
    color: ${theme.colors.textPrimary};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  /* Dark Theme */
  body.dark-theme {
    background: #1a1a1a;
    color: #e5e5e5;

    input, select, textarea {
      background: #2d2d2d;
      color: #e5e5e5;
      border-color: #404040;

      &:focus {
        border-color: #7c3aed;
        box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.2);
      }

      &:read-only,
      &:disabled {
        background: #1f1f1f;
        color: #a0a0a0;
        border-color: #404040;
        cursor: not-allowed;
      }
    }

    /* Fix select dropdown options */
    select option {
      background: #2d2d2d;
      color: #e5e5e5;
    }

    input[type="date"],
    input[type="time"],
    input[type="datetime-local"] {
      background: #2d2d2d;
      color: #e5e5e5;
      border-color: #404040;

      &::-webkit-calendar-picker-indicator {
        filter: invert(1);
      }
    }

    ::-webkit-scrollbar-track {
      background: #2d2d2d;
    }

    ::-webkit-scrollbar-thumb {
      background: #555;

      &:hover {
        background: #666;
      }
    }

    ::selection {
      background: rgba(124, 58, 237, 0.3);
      color: #e5e5e5;
    }
  }

  button {
    cursor: pointer;
    font-family: inherit;
  }

  input, select, textarea {
    font-family: inherit;
  }

  /* Modern Date Input Styling */
  input[type="date"],
  input[type="time"],
  input[type="datetime-local"] {
    position: relative;
    padding: 10px 12px;
    font-family: inherit;
    font-size: 14px;
    cursor: pointer;
    background: white;
    border: 1px solid ${theme.colors.gray300};
    border-radius: 6px;
    transition: all 0.2s ease;
    color: ${theme.colors.gray700};

    &:hover {
      border-color: ${theme.colors.gray400};
    }

    &:focus {
      outline: none;
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    /* Calendar icon styling */
    &::-webkit-calendar-picker-indicator {
      cursor: pointer;
      width: 20px;
      height: 20px;
      padding: 2px;
      margin-left: 8px;
      opacity: 0.6;
      transition: opacity 0.2s ease;
      filter: grayscale(100%) brightness(0.8);
      
      &:hover {
        opacity: 1;
        filter: grayscale(100%) brightness(0.6);
      }
    }

    /* Firefox */
    &::-moz-calendar-picker-indicator {
      cursor: pointer;
      opacity: 0.6;
      
      &:hover {
        opacity: 1;
      }
    }
  }

  /* Date input text fields */
  input[type="date"]::-webkit-datetime-edit-fields-wrapper {
    padding: 0;
  }

  input[type="date"]::-webkit-datetime-edit-text {
    color: ${theme.colors.gray500};
    padding: 0 2px;
  }

  input[type="date"]::-webkit-datetime-edit-month-field,
  input[type="date"]::-webkit-datetime-edit-day-field,
  input[type="date"]::-webkit-datetime-edit-year-field {
    color: ${theme.colors.gray700};
    font-weight: 500;
    padding: 2px;
    
    &:focus {
      background: #eef2ff;
      color: #6366f1;
      outline: none;
      border-radius: 3px;
    }
  }

  /* Placeholder state */
  input[type="date"]:invalid::-webkit-datetime-edit {
    color: ${theme.colors.gray400};
  }

  input[type="date"]::placeholder {
    color: ${theme.colors.gray400};
  }

  /* Scrollbar Styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.gray100};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.gray400};
    border-radius: 4px;
    
    &:hover {
      background: ${theme.colors.gray500};
    }
  }

  /* Selection Styling */
  ::selection {
    background: rgba(99, 102, 241, 0.2);
    color: ${theme.colors.textPrimary};
  }

  /* Focus Visible */
  *:focus-visible {
    outline: 2px solid #6366f1;
    outline-offset: 2px;
  }

  /* Smooth Scrolling */
  html {
    scroll-behavior: smooth;
  }

  /* Loading Skeleton Animation */
  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }

  .skeleton {
    animation: shimmer 2s infinite linear;
    background: linear-gradient(
      to right,
      #f0f0f0 0%,
      #f8f8f8 20%,
      #f0f0f0 40%,
      #f0f0f0 100%
    );
    background-size: 1000px 100%;
    border-radius: 4px;

    body.dark-theme & {
      background: linear-gradient(
        to right,
        #2d2d2d 0%,
        #3d3d3d 20%,
        #2d2d2d 40%,
        #2d2d2d 100%
      );
    }
  }

  /* Smooth Page Transitions */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .page-enter {
    animation: fadeInUp 0.3s ease-out;
  }

  /* Remove number input arrows */
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }

  /* Print Styles */
  @media print {
    @page {
      margin: 1cm;
      size: portrait;
    }

    body {
      background: white;
      color: black;
    }

    /* Hide navigation, sidebar, and other UI elements */
    nav,
    aside,
    header,
    footer,
    .no-print,
    button,
    [role="navigation"],
    [role="banner"],
    [role="contentinfo"] {
      display: none !important;
    }

    /* Ensure content is visible */
    main {
      display: block !important;
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    /* Remove shadows and borders for cleaner print */
    * {
      box-shadow: none !important;
      text-shadow: none !important;
    }

    /* Ensure tables break properly */
    table {
      page-break-inside: auto;
    }

    tr {
      page-break-inside: avoid;
      page-break-after: auto;
    }

    thead {
      display: table-header-group;
    }

    /* Avoid breaking charts and cards */
    .chart-container,
    .stat-card {
      page-break-inside: avoid;
    }

    /* Optimize colors for print */
    a {
      text-decoration: underline;
      color: black !important;
    }

    /* Show URLs for links */
    a[href]:after {
      content: " (" attr(href) ")";
      font-size: 0.8em;
    }

    /* Don't show URLs for internal links */
    a[href^="#"]:after,
    a[href^="javascript:"]:after {
      content: "";
    }
  }
`;

export default GlobalStyles;
