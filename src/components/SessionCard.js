import React from 'react';
import { Calendar, Tag, ExternalLink, Edit, Trash2 } from 'lucide-react';

const SessionCard = ({ session, showActions = false, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const badgeClasses = {
      draft: 'bg-yellow-100 text-yellow-800',
      published: 'bg-green-100 text-green-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2 mb-2 sm:mb-0">
          {session.title}
        </h3>
        {showActions && (
          <div className="flex items-center space-x-2">
            {getStatusBadge(session.status)}
          </div>
        )}
      </div>

      {session.tags && session.tags.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center flex-wrap gap-2">
            <Tag className="w-4 h-4 text-gray-500" />
            {session.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-sm text-gray-500 mb-4">
        <div className="flex items-center mb-2 sm:mb-0">
          <Calendar className="w-4 h-4 mr-1" />
          Created: {formatDate(session.created_at)}
        </div>
        {session.updated_at !== session.created_at && (
          <span className="sm:ml-4">
            Updated: {formatDate(session.updated_at)}
          </span>
        )}
      </div>

      {session.user_id?.email && !showActions && (
        <div className="text-xs sm:text-sm text-gray-600 mb-4">
          By: {session.user_id.email}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <a
          href={session.json_file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          <ExternalLink className="w-4 h-4 mr-1" />
          View Session Data
        </a>

        {showActions && (
          <div className="flex items-center space-x-2">
            {onEdit && (
              <button
                onClick={() => onEdit(session)}
                className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(session)}
                className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionCard;