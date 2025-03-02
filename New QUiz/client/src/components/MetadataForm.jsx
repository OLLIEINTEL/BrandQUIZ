import React from 'react';

const MetadataForm = ({ formData, onChange, errors }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Almost there! Tell us about your brand
      </h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Your Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={onChange}
            className="mt-1 input"
            required
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            className="mt-1 input"
            required
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
            Company Name *
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={onChange}
            className="mt-1 input"
            required
          />
          {errors.companyName && (
            <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700">
            Website URL *
          </label>
          <input
            type="url"
            id="websiteUrl"
            name="websiteUrl"
            value={formData.websiteUrl}
            onChange={onChange}
            className="mt-1 input"
            placeholder="https://example.com"
            required
          />
          {errors.websiteUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.websiteUrl}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetadataForm; 