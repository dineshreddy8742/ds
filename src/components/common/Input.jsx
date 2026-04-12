import React from 'react';

export const Input = ({
  label,
  error,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  style = {},
  ...props
}) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && (
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: 500,
          color: '#a1a1aa',
        }}>
          {label}
          {required && <span style={{ color: '#ef4444', marginLeft: '0.25rem' }}>*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          background: '#1e293b',
          border: `1px solid ${error ? '#ef4444' : '#334155'}`,
          borderRadius: '12px',
          color: '#f8fafc',
          fontSize: '1rem',
          outline: 'none',
          transition: 'border-color 0.2s',
          ...style,
        }}
        {...props}
      />
      {error && (
        <p style={{
          marginTop: '0.5rem',
          fontSize: '0.875rem',
          color: '#ef4444',
        }}>
          {error}
        </p>
      )}
    </div>
  );
};

export const Select = ({
  label,
  error,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  required = false,
  disabled = false,
}) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && (
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: 500,
          color: '#a1a1aa',
        }}>
          {label}
          {required && <span style={{ color: '#ef4444', marginLeft: '0.25rem' }}>*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          background: '#1e293b',
          border: `1px solid ${error ? '#ef4444' : '#334155'}`,
          borderRadius: '12px',
          color: '#f8fafc',
          fontSize: '1rem',
          outline: 'none',
          appearance: 'none',
          cursor: 'pointer',
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p style={{
          marginTop: '0.5rem',
          fontSize: '0.875rem',
          color: '#ef4444',
        }}>
          {error}
        </p>
      )}
    </div>
  );
};

export const Textarea = ({
  label,
  error,
  value,
  onChange,
  placeholder,
  rows = 4,
  required = false,
  disabled = false,
}) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && (
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: 500,
          color: '#a1a1aa',
        }}>
          {label}
          {required && <span style={{ color: '#ef4444', marginLeft: '0.25rem' }}>*</span>}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        disabled={disabled}
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          background: '#1e293b',
          border: `1px solid ${error ? '#ef4444' : '#334155'}`,
          borderRadius: '12px',
          color: '#f8fafc',
          fontSize: '1rem',
          outline: 'none',
          resize: 'vertical',
          fontFamily: 'inherit',
        }}
      />
      {error && (
        <p style={{
          marginTop: '0.5rem',
          fontSize: '0.875rem',
          color: '#ef4444',
        }}>
          {error}
        </p>
      )}
    </div>
  );
};
