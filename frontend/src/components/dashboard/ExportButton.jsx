import { useState } from 'react';
import { Download } from 'lucide-react';
import { emotionalService } from '../../services/emotional.service';
import { useToastStore } from '../../stores/toast.store';

export function ExportButton() {
  const [loading, setLoading] = useState(false);
  const toast = useToastStore((s) => s.push);

  const handleExport = async () => {
    setLoading(true);
    try {
      await emotionalService.exportCsv();
      toast(
        'success',
        'Tu archivo se descargo. Puedes abrirlo en Excel o compartirlo con tu profesional de confianza.'
      );
    } catch (_e) {
      toast('error', 'No se pudo exportar los registros');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="p-2 text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50"
      title="Exportar mis registros (.csv)"
      aria-label="Exportar mis registros en formato CSV"
    >
      <Download className={loading ? 'h-5 w-5 animate-pulse' : 'h-5 w-5'} />
    </button>
  );
}
