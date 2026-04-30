import PropTypes from 'prop-types';
import { AlertCircle } from 'lucide-react';

export function LogoutModal({ open, onConfirm, onCancel }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div
        className="bg-surface-card rounded-lg shadow-elevated p-6 w-full max-w-sm text-center"
        role="dialog"
        aria-modal="true"
      >
        <div className="w-12 h-12 rounded-full bg-feedback-error/10 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6 text-feedback-error" />
        </div>
        <h3 className="text-h3 text-text-primary mb-2">Cerrar sesion</h3>
        <p className="text-body text-text-secondary mb-6">
          Estas seguro de que deseas salir de tu cuenta? Tendras que iniciar sesion de nuevo.
        </p>
        <button
          onClick={onConfirm}
          className="w-full py-3 px-5 bg-feedback-error text-white rounded-md text-body font-semibold leading-none hover:opacity-90 transition-opacity duration-150"
        >
          Confirmar y cerrar
        </button>
        <button
          onClick={onCancel}
          className="w-full mt-3 py-2 text-body text-text-secondary hover:text-text-primary transition-colors duration-150"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

LogoutModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
