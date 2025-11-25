'use client';

import { LeadReport, BusinessData } from '@/types';
import { Download, ExternalLink, Mail, Phone, MapPin, Globe, AlertCircle } from 'lucide-react';

interface ResultsDisplayProps {
  report: LeadReport;
}

export default function ResultsDisplay({ report }: ResultsDisplayProps) {
  const downloadCSV = () => {
    const headers = ['Business Name', 'Address', 'Phone', 'Email', 'Website', 'Website Status', 'Quality Score', 'Opportunity Level', 'Google Maps'];
    const rows = report.leads.map(lead => [
      lead.name,
      lead.address,
      lead.phone || 'N/A',
      lead.email || 'N/A',
      lead.website || 'None',
      lead.websiteStatus,
      lead.websiteQuality?.score || 0,
      lead.opportunity,
      lead.googleMapsUrl || 'N/A',
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getOpportunityColor = (opportunity: string) => {
    switch (opportunity) {
      case 'high':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="mt-8 space-y-6">
      {/* Summary Cards */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Lead Report</h2>
          <button
            onClick={downloadCSV}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Download size={18} />
            Download CSV
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
            <p className="text-sm text-blue-600 dark:text-blue-300">Total Leads</p>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-200">{report.totalLeads}</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
            <p className="text-sm text-purple-600 dark:text-purple-300">No Website</p>
            <p className="text-2xl font-bold text-purple-700 dark:text-purple-200">{report.summary.noWebsite}</p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900 p-4 rounded-lg">
            <p className="text-sm text-orange-600 dark:text-orange-300">Poor Website</p>
            <p className="text-2xl font-bold text-orange-700 dark:text-orange-200">{report.summary.poorWebsite}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-300">High Priority</p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-200">{report.summary.highOpportunity}</p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
            <p className="text-sm text-yellow-600 dark:text-yellow-300">Medium Priority</p>
            <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-200">{report.summary.mediumOpportunity}</p>
          </div>
        </div>
      </div>

      {/* Leads List */}
      <div className="space-y-4">
        {report.leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} getOpportunityColor={getOpportunityColor} />
        ))}
      </div>
    </div>
  );
}

function LeadCard({ lead, getOpportunityColor }: { lead: BusinessData; getOpportunityColor: (opp: string) => string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{lead.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{lead.category}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getOpportunityColor(lead.opportunity)}`}>
          {lead.opportunity.toUpperCase()} PRIORITY
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
          <MapPin size={16} className="mt-0.5 flex-shrink-0" />
          <span>{lead.address}</span>
        </div>
        {lead.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Phone size={16} className="flex-shrink-0" />
            <a href={`tel:${lead.phone}`} className="hover:text-indigo-600">{lead.phone}</a>
          </div>
        )}
        {lead.email && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Mail size={16} className="flex-shrink-0" />
            <a href={`mailto:${lead.email}`} className="hover:text-indigo-600">{lead.email}</a>
          </div>
        )}
      </div>

      <div className="border-t dark:border-gray-700 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {lead.websiteStatus === 'none' ? (
              <span className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium">
                <AlertCircle size={16} />
                No Website
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-blue-600" />
                <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                  View Website
                </a>
                {lead.websiteQuality && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    (Score: {lead.websiteQuality.score}/100)
                  </span>
                )}
              </div>
            )}
          </div>
          {lead.googleMapsUrl && (
            <a
              href={lead.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
            >
              <ExternalLink size={14} />
              Maps
            </a>
          )}
        </div>

        {lead.websiteQuality && lead.websiteQuality.issues.length > 0 && (
          <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
            <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-300 mb-1">Website Issues:</p>
            <ul className="text-xs text-yellow-700 dark:text-yellow-400 list-disc list-inside">
              {lead.websiteQuality.issues.map((issue, idx) => (
                <li key={idx}>{issue}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
