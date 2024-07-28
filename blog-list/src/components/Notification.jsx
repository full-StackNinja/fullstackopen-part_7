import PropTypes from 'prop-types';

const Notification = ({ message, styles }) => {
  return <div style={styles}>{message}</div>;
};

Notification.proptypes = {
  message: PropTypes.string.isRequired,
  styles: PropTypes.object.isRequired,
};
export default Notification;
