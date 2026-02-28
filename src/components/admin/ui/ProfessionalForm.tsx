import React from 'react';

interface FormField {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea';
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
}

interface ProfessionalFormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, unknown>) => void;
  submitText?: string;
  cancelText?: string;
  onCancel?: () => void;
  loading?: boolean;
}

const ProfessionalForm: React.FC<ProfessionalFormProps> = ({
  fields,
  onSubmit,
  submitText = 'Submit',
  cancelText = 'Cancel',
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = React.useState<Record<string, unknown>>({});

  React.useEffect(() => {
    const initialData: Record<string, any> = {};
    fields.forEach(field => {
      initialData[field.name] = field.value || '';
    });
    setFormData(initialData);
  }, [fields]);

  const handleChange = (name: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'select':
        return (
          <select
            name={field.name}
            value={(formData[field.name] as string | number) || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-primary focus:border-primary"
            required={field.required}
          >
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'textarea':
        return (
          <textarea
            name={field.name}
            value={(formData[field.name] as string | number) || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-primary focus:border-primary"
            required={field.required}
          />
        );
      default:
        return (
          <input
            type={field.type || 'text'}
            name={field.name}
            value={(formData[field.name] as string | number) || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-primary focus:border-primary"
            required={field.required}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              {field.label} {field.required && <span className="text-red-400">*</span>}
            </label>
            {renderField(field)}
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
          >
            {cancelText}
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md transition-colors flex items-center"
        >
          {loading && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {submitText}
        </button>
      </div>
    </form>
  );
};

export default ProfessionalForm;