import React from 'react';
import PropTypes from 'prop-types';
import './AmbulanceCard.css';

const AmbulanceCard = ({
  patientId,
  patientName,
  type = 'Ambulance',
  eta = '10-15 min',
  phone,
  address,
  onViewMap,
  status = 'available',
  vehicleNumber = ''
}) => {
  return (
    <div className="ambulance-card">
      <div className="ambulance-card__content">
        <div className="ambulance-card__header">
          <div>
            <h3 className="ambulance-card__title">{patientName}</h3>
            {type && <span className="ambulance-card__type">{type}</span>}
            {vehicleNumber && <span className="ambulance-card__vehicle">#{vehicleNumber}</span>}
          </div>
          <div className="ambulance-card__status-container">
            <span className={`ambulance-card__status ambulance-card__status--${status}`}>
              {status.toUpperCase()}
            </span>
            <span className="ambulance-card__eta">⏱️ {eta}</span>
          </div>
        </div>
        
        <div className="ambulance-card__details">
          <p className="ambulance-card__detail">
            <span className="ambulance-card__icon">📞</span>
            <a 
              href={`tel:${phone ? phone.replace(/\D/g, '') : ''}`} 
              className="ambulance-card__link"
              aria-label={`Call ${patientName || 'ambulance'}`}
            >
              {phone || 'Not available'}
            </a>
          </p>
          
          <p className="ambulance-card__detail">
            <span className="ambulance-card__icon">📍</span>
            <span className="ambulance-card__address">{address}</span>
          </p>
        </div>
        
        <div className="ambulance-card__actions">
          <button 
            className="ambulance-card__button"
            onClick={onViewMap}
            aria-label={`View ${patientName || 'ambulance'} on map`}
          >
            <span className="ambulance-card__button-icon">🗺️</span>
            View on Map
          </button>
          <a 
            href={`tel:${phone ? phone.replace(/\D/g, '') : ''}`} 
            className={`ambulance-card__button ambulance-card__button--primary ${!phone ? 'ambulance-card__button--disabled' : ''}`}
            aria-label={`Call ${patientName || 'ambulance'}`}
            aria-disabled={!phone}
            onClick={e => !phone && e.preventDefault()}
          >
            <span className="ambulance-card__button-icon">📞</span>
            Call Now
          </a>
        </div>
      </div>
    </div>
  );
};

AmbulanceCard.propTypes = {
  patientId: PropTypes.string.isRequired,
  patientName: PropTypes.string.isRequired,
  type: PropTypes.string,
  eta: PropTypes.string,
  phone: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  onViewMap: PropTypes.func.isRequired,
  status: PropTypes.oneOf(['available', 'on-route', 'unavailable']),
  vehicleNumber: PropTypes.string
};

export default AmbulanceCard;
