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
  className = '',
  style = {},
  ...props
}) => {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {label && (
        <label style={{
          display: 'block',
          marginBottom: '0.6rem',
          fontSize: '0.8125rem',
          fontWeight: 700,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          {label}
          {required && <span style={{ color: 'var(--danger)', marginLeft: '0.25rem' }}>*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`input-control ${className}`}
        style={{ ...style }}
        {...props}
      />
      {error && (
        <p style={{
          marginTop: '0.5rem',
          fontSize: '0.8125rem',
          color: 'var(--danger)',
          fontWeight: 600
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
  className = '',
  style = {},
}) => {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {label && (
        <label style={{
          display: 'block',
          marginBottom: '0.6rem',
          fontSize: '0.8125rem',
          fontWeight: 700,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          {label}
          {required && <span style={{ color: 'var(--danger)', marginLeft: '0.25rem' }}>*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`input-control ${className}`}
        style={{ cursor: 'pointer', appearance: 'none', ...style }}
      >
        <option value="" style={{ background: 'var(--panel-bg)' }}>{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value} style={{ background: 'var(--panel-bg)' }}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p style={{
          marginTop: '0.5rem',
          fontSize: '0.8125rem',
          color: 'var(--danger)',
          fontWeight: 600
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
  className = '',
  style = {},
}) => {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {label && (
        <label style={{
          display: 'block',
          marginBottom: '0.6rem',
          fontSize: '0.8125rem',
          fontWeight: 700,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          {label}
          {required && <span style={{ color: 'var(--danger)', marginLeft: '0.25rem' }}>*</span>}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        disabled={disabled}
        className={`input-control ${className}`}
        style={{ resize: 'vertical', minHeight: '100px', ...style }}
      />
      {error && (
        <p style={{
          marginTop: '0.5rem',
          fontSize: '0.8125rem',
          color: 'var(--danger)',
          fontWeight: 600
        }}>
          {error}
        </p>
      )}
    </div>
  );
};
