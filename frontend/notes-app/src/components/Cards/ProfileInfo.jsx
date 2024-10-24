/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { getInitials } from '../../utils/helper';

const ProfileInfo = ({ userInfo, onLogout }) => {
  if (!userInfo || !userInfo.fullName) {
    return null; 
  }

  return (
    <div className="profile-info flex items-center gap-3">
      <div className="w-12 h-12 flex items-center justify-center rounded-full initials">
        {getInitials(userInfo.fullName)}
      </div>
      <div>
        <p className="text-sm font-medium name">{userInfo.fullName}</p>
        <button className="text-sm underline logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

ProfileInfo.propTypes = {
  userInfo: PropTypes.shape({
    fullName: PropTypes.string.isRequired,
  }).isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default ProfileInfo;
