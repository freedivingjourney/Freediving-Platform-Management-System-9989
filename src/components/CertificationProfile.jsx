import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useRole } from '../contexts/RoleContext';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';
import * as FiIcons from 'react-icons/fi';

const {
  FiCertificate,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSave,
  FiX,
  FiCalendar,
  FiUser,
  FiFileText,
  FiUpload,
  FiDownload,
  FiEye,
  FiCheckCircle,
  FiAlertCircle,
  FiSearch,
  FiFilter,
  FiInfo,
  FiShield,
  FiLock
} = FiIcons;

const CertificationProfile = () => {
  const { user } = useAuth();
  const { hasPermission } = useRole();
  const [certifications, setCertifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Edit states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCertification, setCurrentCertification] = useState(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAgency, setFilterAgency] = useState('all');
  const [showExpired, setShowExpired] = useState(false);
  const [showExpiring, setShowExpiring] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState({
    agency: '',
    name: '',
    level: '',
    issue_date: '',
    expiry_date: '',
    instructor: '',
    certificate_number: '',
    document_url: '',
    verified: false
  });
  
  // Form errors
  const [formErrors, setFormErrors] = useState({});
  
  // File upload state
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Common certification agencies for dropdown
  const commonAgencies = [
    'AIDA International',
    'SSI (Scuba Schools International)',
    'PADI',
    'Molchanovs',
    'CMAS',
    'FII (Freediving Instructors International)',
    'RAID',
    'EFR (Emergency First Response)',
    'DAN (Divers Alert Network)',
    'Other'
  ];
  
  // Fetch certifications
  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('user_certifications_ld5q7f')
          .select('*')
          .eq('user_email', user.email)
          .order('issue_date', { ascending: false });
          
        if (error) throw error;
        
        setCertifications(data || []);
      } catch (err) {
        console.error('Error fetching certifications:', err);
        setError('Failed to load certifications. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user?.email) {
      fetchCertifications();
    }
  }, [user?.email]);
  
  // Filter and search certifications
  const filteredCertifications = certifications.filter(cert => {
    const matchesSearch = 
      cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.agency.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.level.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cert.instructor && cert.instructor.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (cert.certificate_number && cert.certificate_number.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesAgency = filterAgency === 'all' || cert.agency === filterAgency;
    
    // Filter for expired certifications
    const isExpired = cert.expiry_date && new Date(cert.expiry_date) < new Date();
    if (!showExpired && isExpired) return false;
    
    // Filter for certifications expiring in the next 90 days
    const isExpiring = cert.expiry_date && 
      new Date(cert.expiry_date) >= new Date() && 
      new Date(cert.expiry_date) <= new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
    if (showExpiring && !isExpiring && !isExpired) return true;
    
    return matchesSearch && matchesAgency;
  });
  
  // Check if a certification is expired
  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };
  
  // Check if a certification is expiring soon (within 90 days)
  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;
    const expiryDateTime = new Date(expiryDate).getTime();
    const currentTime = Date.now();
    const ninetyDaysInMs = 90 * 24 * 60 * 60 * 1000;
    
    return expiryDateTime > currentTime && expiryDateTime <= currentTime + ninetyDaysInMs;
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };
  
  // Calculate days until expiry
  const daysUntilExpiry = (expiryDate) => {
    if (!expiryDate) return null;
    const expiry = new Date(expiryDate).getTime();
    const now = Date.now();
    return Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
  };
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  // Handle file change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setFormErrors(prev => ({ 
          ...prev, 
          document: 'File size exceeds 5MB limit' 
        }));
        return;
      }
      
      if (!['image/jpeg', 'image/png', 'application/pdf'].includes(selectedFile.type)) {
        setFormErrors(prev => ({ 
          ...prev, 
          document: 'Only JPEG, PNG, and PDF files are allowed' 
        }));
        return;
      }
      
      setFile(selectedFile);
      setFormErrors(prev => ({ ...prev, document: null }));
    }
  };
  
  // Upload file to storage
  const uploadFile = async () => {
    if (!file) return null;
    
    try {
      setIsUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `certification-documents/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('user-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (error) throw error;
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('user-documents')
        .getPublicUrl(filePath);
        
      return publicUrl;
    } catch (err) {
      console.error('Error uploading file:', err);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.agency) errors.agency = 'Agency is required';
    if (!formData.name) errors.name = 'Certification name is required';
    if (!formData.level) errors.level = 'Level is required';
    if (!formData.issue_date) errors.issue_date = 'Issue date is required';
    
    if (formData.expiry_date && formData.issue_date && new Date(formData.expiry_date) < new Date(formData.issue_date)) {
      errors.expiry_date = 'Expiry date cannot be before issue date';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle add certification
  const handleAddCertification = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      let documentUrl = formData.document_url;
      
      // If there's a file to upload
      if (file) {
        documentUrl = await uploadFile();
      }
      
      const { data, error } = await supabase
        .from('user_certifications_ld5q7f')
        .insert([
          {
            user_email: user.email,
            agency: formData.agency,
            name: formData.name,
            level: formData.level,
            issue_date: formData.issue_date,
            expiry_date: formData.expiry_date || null,
            instructor: formData.instructor || null,
            certificate_number: formData.certificate_number || null,
            document_url: documentUrl
          }
        ])
        .select();
        
      if (error) throw error;
      
      // Update local state
      setCertifications(prev => [...prev, data[0]]);
      
      // Reset form and close modal
      setFormData({
        agency: '',
        name: '',
        level: '',
        issue_date: '',
        expiry_date: '',
        instructor: '',
        certificate_number: '',
        document_url: '',
        verified: false
      });
      setFile(null);
      setIsAddModalOpen(false);
    } catch (err) {
      console.error('Error adding certification:', err);
      setFormErrors(prev => ({ ...prev, form: 'Failed to add certification. Please try again.' }));
    }
  };
  
  // Handle edit certification
  const handleEditCertification = async (e) => {
    e.preventDefault();
    
    if (!validateForm() || !currentCertification) return;
    
    try {
      let documentUrl = formData.document_url;
      
      // If there's a file to upload
      if (file) {
        documentUrl = await uploadFile();
      }
      
      const { data, error } = await supabase
        .from('user_certifications_ld5q7f')
        .update({
          agency: formData.agency,
          name: formData.name,
          level: formData.level,
          issue_date: formData.issue_date,
          expiry_date: formData.expiry_date || null,
          instructor: formData.instructor || null,
          certificate_number: formData.certificate_number || null,
          document_url: documentUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentCertification.id)
        .select();
        
      if (error) throw error;
      
      // Update local state
      setCertifications(prev => 
        prev.map(cert => 
          cert.id === currentCertification.id ? data[0] : cert
        )
      );
      
      // Reset and close modal
      setCurrentCertification(null);
      setFile(null);
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Error updating certification:', err);
      setFormErrors(prev => ({ ...prev, form: 'Failed to update certification. Please try again.' }));
    }
  };
  
  // Handle delete certification
  const handleDeleteCertification = async () => {
    if (!currentCertification) return;
    
    try {
      const { error } = await supabase
        .from('user_certifications_ld5q7f')
        .delete()
        .eq('id', currentCertification.id);
        
      if (error) throw error;
      
      // Update local state
      setCertifications(prev => 
        prev.filter(cert => cert.id !== currentCertification.id)
      );
      
      // Reset and close modal
      setCurrentCertification(null);
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error('Error deleting certification:', err);
      setFormErrors(prev => ({ ...prev, form: 'Failed to delete certification. Please try again.' }));
    }
  };
  
  // Open edit modal
  const openEditModal = (certification) => {
    setCurrentCertification(certification);
    setFormData({
      agency: certification.agency,
      name: certification.name,
      level: certification.level,
      issue_date: certification.issue_date,
      expiry_date: certification.expiry_date || '',
      instructor: certification.instructor || '',
      certificate_number: certification.certificate_number || '',
      document_url: certification.document_url || '',
      verified: certification.verified
    });
    setIsEditModalOpen(true);
  };
  
  // Open delete modal
  const openDeleteModal = (certification) => {
    setCurrentCertification(certification);
    setIsDeleteModalOpen(true);
  };
  
  // View document
  const viewDocument = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };
  
  // Get certification color based on status
  const getCertificationColor = (certification) => {
    if (isExpired(certification.expiry_date)) {
      return 'bg-red-50 border-red-200';
    }
    if (isExpiringSoon(certification.expiry_date)) {
      return 'bg-yellow-50 border-yellow-200';
    }
    if (certification.verified) {
      return 'bg-green-50 border-green-200';
    }
    return 'bg-white border-gray-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Certification Profile</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-ocean-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-ocean-700 transition-colors flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} />
          <span>Add Certification</span>
        </button>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search certifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <SafeIcon icon={FiFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterAgency}
              onChange={(e) => setFilterAgency(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Agencies</option>
              {[...new Set(certifications.map(cert => cert.agency))].map(agency => (
                <option key={agency} value={agency}>{agency}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={showExpired}
                onChange={(e) => setShowExpired(e.target.checked)}
                className="rounded border-gray-300 text-ocean-600 focus:ring-ocean-500"
              />
              <span>Show Expired</span>
            </label>
            
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={showExpiring}
                onChange={(e) => setShowExpiring(e.target.checked)}
                className="rounded border-gray-300 text-ocean-600 focus:ring-ocean-500"
              />
              <span>Show Expiring</span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Certifications List */}
      {isLoading ? (
        <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200 flex justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-600 mb-4"></div>
            <p className="text-gray-600">Loading certifications...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 rounded-lg shadow-sm p-6 border border-red-200 flex items-start space-x-4">
          <SafeIcon icon={FiAlertCircle} className="text-red-600 text-xl flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Certifications</h3>
            <p className="text-red-700">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      ) : filteredCertifications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-200 flex flex-col items-center">
          <SafeIcon icon={FiCertificate} className="text-5xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Certifications Found</h3>
          <p className="text-gray-500 mb-6 text-center">
            {searchTerm || filterAgency !== 'all' ? 
              'Try adjusting your search or filters to see more results.' : 
              'Start by adding your freediving certifications to keep track of your achievements.'}
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-ocean-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-ocean-700 transition-colors"
          >
            Add Your First Certification
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCertifications.map(cert => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-lg shadow-sm p-4 border ${getCertificationColor(cert)} hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-ocean-100 rounded-lg flex items-center justify-center">
                    <SafeIcon icon={FiCertificate} className="text-2xl text-ocean-600" />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <span className="font-medium">Agency:</span> {cert.agency}
                      </p>
                      <p>
                        <span className="font-medium">Level:</span> {cert.level}
                      </p>
                      <div className="flex flex-wrap gap-x-6 gap-y-1 mt-1">
                        <div className="flex items-center space-x-1 text-xs">
                          <SafeIcon icon={FiCalendar} className="text-gray-400" />
                          <span>Issued: {formatDate(cert.issue_date)}</span>
                        </div>
                        
                        {cert.expiry_date && (
                          <div className={`flex items-center space-x-1 text-xs ${isExpired(cert.expiry_date) ? 'text-red-600' : isExpiringSoon(cert.expiry_date) ? 'text-yellow-600' : 'text-gray-600'}`}>
                            <SafeIcon icon={FiCalendar} className={isExpired(cert.expiry_date) ? 'text-red-400' : isExpiringSoon(cert.expiry_date) ? 'text-yellow-400' : 'text-gray-400'} />
                            <span>
                              Expires: {formatDate(cert.expiry_date)}
                              {isExpired(cert.expiry_date) ? 
                                ' (Expired)' : 
                                isExpiringSoon(cert.expiry_date) ? 
                                  ` (${daysUntilExpiry(cert.expiry_date)} days left)` : 
                                  ''
                              }
                            </span>
                          </div>
                        )}
                        
                        {cert.instructor && (
                          <div className="flex items-center space-x-1 text-xs">
                            <SafeIcon icon={FiUser} className="text-gray-400" />
                            <span>Instructor: {cert.instructor}</span>
                          </div>
                        )}
                        
                        {cert.certificate_number && (
                          <div className="flex items-center space-x-1 text-xs">
                            <SafeIcon icon={FiFileText} className="text-gray-400" />
                            <span>Cert #: {cert.certificate_number}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  {cert.verified && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium flex items-center">
                      <SafeIcon icon={FiCheckCircle} className="mr-1" />
                      Verified
                    </span>
                  )}
                  
                  <div className="flex space-x-2">
                    {cert.document_url && (
                      <button
                        onClick={() => viewDocument(cert.document_url)}
                        className="p-2 text-ocean-600 hover:text-ocean-800 hover:bg-ocean-50 rounded-lg transition-colors"
                        title="View Document"
                      >
                        <SafeIcon icon={FiEye} className="text-sm" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => openEditModal(cert)}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <SafeIcon icon={FiEdit2} className="text-sm" />
                    </button>
                    
                    <button
                      onClick={() => openDeleteModal(cert)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <SafeIcon icon={FiTrash2} className="text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {/* Add Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsAddModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Add New Certification</h2>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <SafeIcon icon={FiX} className="text-xl text-gray-400" />
                </button>
              </div>
              
              <form onSubmit={handleAddCertification} className="p-6 space-y-4">
                {formErrors.form && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <SafeIcon icon={FiAlertCircle} className="text-red-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{formErrors.form}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Certification Agency*
                    </label>
                    <select
                      name="agency"
                      value={formData.agency}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${
                        formErrors.agency ? 'border-red-300' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent`}
                      required
                    >
                      <option value="">Select Agency</option>
                      {commonAgencies.map(agency => (
                        <option key={agency} value={agency}>{agency}</option>
                      ))}
                    </select>
                    {formErrors.agency && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.agency}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Certification Name*
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Freediver, Advanced Freediver"
                      className={`w-full px-4 py-3 border ${
                        formErrors.name ? 'border-red-300' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent`}
                      required
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Level/Type*
                    </label>
                    <input
                      type="text"
                      name="level"
                      value={formData.level}
                      onChange={handleInputChange}
                      placeholder="e.g., Level 1, Level 2, Instructor"
                      className={`w-full px-4 py-3 border ${
                        formErrors.level ? 'border-red-300' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent`}
                      required
                    />
                    {formErrors.level && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.level}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Certificate Number
                    </label>
                    <input
                      type="text"
                      name="certificate_number"
                      value={formData.certificate_number}
                      onChange={handleInputChange}
                      placeholder="e.g., AIDA-12345"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Issue Date*
                    </label>
                    <input
                      type="date"
                      name="issue_date"
                      value={formData.issue_date}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${
                        formErrors.issue_date ? 'border-red-300' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent`}
                      required
                    />
                    {formErrors.issue_date && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.issue_date}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date (if applicable)
                    </label>
                    <input
                      type="date"
                      name="expiry_date"
                      value={formData.expiry_date}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${
                        formErrors.expiry_date ? 'border-red-300' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent`}
                    />
                    {formErrors.expiry_date && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.expiry_date}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instructor Name
                  </label>
                  <input
                    type="text"
                    name="instructor"
                    value={formData.instructor}
                    onChange={handleInputChange}
                    placeholder="e.g., Sarah Johnson"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Certificate Document (Optional)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <SafeIcon icon={FiUpload} className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-ocean-600 hover:text-ocean-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-ocean-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, PDF up to 5MB
                      </p>
                      {file && (
                        <p className="text-sm text-green-600 mt-2">
                          {file.name} selected
                        </p>
                      )}
                      {formErrors.document && (
                        <p className="text-sm text-red-600 mt-2">
                          {formErrors.document}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <SafeIcon icon={FiInfo} className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        Your certification will be reviewed by an administrator or instructor for verification.
                        Once verified, it will be marked as official in your profile.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="flex-1 bg-ocean-600 text-white py-3 rounded-lg font-medium hover:bg-ocean-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <SafeIcon icon={FiSave} />
                        <span>Save Certification</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && currentCertification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsEditModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Edit Certification</h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <SafeIcon icon={FiX} className="text-xl text-gray-400" />
                </button>
              </div>
              
              <form onSubmit={handleEditCertification} className="p-6 space-y-4">
                {formErrors.form && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <SafeIcon icon={FiAlertCircle} className="text-red-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{formErrors.form}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Certification Agency*
                    </label>
                    <select
                      name="agency"
                      value={formData.agency}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${
                        formErrors.agency ? 'border-red-300' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent`}
                      required
                    >
                      <option value="">Select Agency</option>
                      {commonAgencies.map(agency => (
                        <option key={agency} value={agency}>{agency}</option>
                      ))}
                    </select>
                    {formErrors.agency && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.agency}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Certification Name*
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Freediver, Advanced Freediver"
                      className={`w-full px-4 py-3 border ${
                        formErrors.name ? 'border-red-300' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent`}
                      required
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Level/Type*
                    </label>
                    <input
                      type="text"
                      name="level"
                      value={formData.level}
                      onChange={handleInputChange}
                      placeholder="e.g., Level 1, Level 2, Instructor"
                      className={`w-full px-4 py-3 border ${
                        formErrors.level ? 'border-red-300' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent`}
                      required
                    />
                    {formErrors.level && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.level}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Certificate Number
                    </label>
                    <input
                      type="text"
                      name="certificate_number"
                      value={formData.certificate_number}
                      onChange={handleInputChange}
                      placeholder="e.g., AIDA-12345"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Issue Date*
                    </label>
                    <input
                      type="date"
                      name="issue_date"
                      value={formData.issue_date}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${
                        formErrors.issue_date ? 'border-red-300' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent`}
                      required
                    />
                    {formErrors.issue_date && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.issue_date}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date (if applicable)
                    </label>
                    <input
                      type="date"
                      name="expiry_date"
                      value={formData.expiry_date}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${
                        formErrors.expiry_date ? 'border-red-300' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent`}
                    />
                    {formErrors.expiry_date && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.expiry_date}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instructor Name
                  </label>
                  <input
                    type="text"
                    name="instructor"
                    value={formData.instructor}
                    onChange={handleInputChange}
                    placeholder="e.g., Sarah Johnson"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Update Certificate Document (Optional)
                  </label>
                  
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <SafeIcon icon={FiUpload} className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload-edit"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-ocean-600 hover:text-ocean-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-ocean-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload-edit"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, PDF up to 5MB
                      </p>
                      {file ? (
                        <p className="text-sm text-green-600 mt-2">
                          {file.name} selected
                        </p>
                      ) : formData.document_url ? (
                        <div className="flex items-center justify-center space-x-2 mt-2">
                          <span className="text-sm text-ocean-600">Current document available</span>
                          <button
                            type="button"
                            onClick={() => viewDocument(formData.document_url)}
                            className="text-ocean-600 hover:text-ocean-700 text-sm"
                          >
                            View
                          </button>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500 mt-2">No document currently uploaded</p>
                      )}
                      {formErrors.document && (
                        <p className="text-sm text-red-600 mt-2">
                          {formErrors.document}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                {hasPermission('APPROVE_CERTIFICATIONS') && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <SafeIcon icon={FiShield} className="text-yellow-600" />
                      <h4 className="font-medium text-yellow-800">Administrator Options</h4>
                    </div>
                    <div className="mt-3 ml-8">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="verified"
                          checked={formData.verified}
                          onChange={(e) => setFormData(prev => ({ ...prev, verified: e.target.checked }))}
                          className="rounded border-gray-300 text-ocean-600 focus:ring-ocean-500"
                        />
                        <span className="text-sm text-yellow-800">Mark as verified</span>
                      </label>
                      <p className="text-xs text-yellow-700 mt-1">
                        This certification has been reviewed and verified by an administrator.
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="flex-1 bg-ocean-600 text-white py-3 rounded-lg font-medium hover:bg-ocean-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <SafeIcon icon={FiSave} />
                        <span>Update Certification</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && currentCertification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full"
            >
              <div className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-red-100 rounded-full p-3">
                    <SafeIcon icon={FiAlertCircle} className="text-2xl text-red-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                  Delete Certification
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Are you sure you want to delete the <strong>{currentCertification.name}</strong> certification from {currentCertification.agency}? This action cannot be undone.
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteCertification}
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Certification Statistics Summary */}
      {!isLoading && !error && certifications.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Certification Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <SafeIcon icon={FiCertificate} className="text-ocean-600 text-xl" />
                <span className="text-2xl font-bold text-ocean-600">{certifications.length}</span>
              </div>
              <p className="text-gray-600 text-sm">Total Certifications</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <SafeIcon icon={FiCheckCircle} className="text-green-600 text-xl" />
                <span className="text-2xl font-bold text-green-600">
                  {certifications.filter(cert => cert.verified).length}
                </span>
              </div>
              <p className="text-gray-600 text-sm">Verified Certifications</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <SafeIcon icon={FiAlertCircle} className="text-yellow-600 text-xl" />
                <span className="text-2xl font-bold text-yellow-600">
                  {certifications.filter(cert => isExpiringSoon(cert.expiry_date)).length}
                </span>
              </div>
              <p className="text-gray-600 text-sm">Expiring Soon</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <SafeIcon icon={FiX} className="text-red-600 text-xl" />
                <span className="text-2xl font-bold text-red-600">
                  {certifications.filter(cert => isExpired(cert.expiry_date)).length}
                </span>
              </div>
              <p className="text-gray-600 text-sm">Expired</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Help & Privacy Info */}
      <div className="mt-8 bg-ocean-50 border border-ocean-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <SafeIcon icon={FiInfo} className="text-ocean-600 mt-1" />
          <div>
            <h4 className="font-medium text-ocean-900 mb-1">About Your Certification Profile</h4>
            <p className="text-sm text-ocean-700 mb-2">
              Keep your certification information up-to-date to help instructors provide appropriate training and ensure your eligibility for courses and events.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-3">
              <div className="flex items-start space-x-2">
                <SafeIcon icon={FiLock} className="text-ocean-600 text-sm mt-0.5" />
                <p className="text-xs text-ocean-700">
                  Your certification details are visible to you, instructors, and administrators only.
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <SafeIcon icon={FiShield} className="text-ocean-600 text-sm mt-0.5" />
                <p className="text-xs text-ocean-700">
                  Certification verification is performed by authorized instructors or administrators.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificationProfile;