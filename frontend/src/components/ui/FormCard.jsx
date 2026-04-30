import PropTypes from 'prop-types';

export function FormCard({ children }) {
  return <div className="bg-surface-card p-6 md:p-8 rounded-lg shadow-card">{children}</div>;
}

FormCard.propTypes = {
  children: PropTypes.node.isRequired,
};
