import { adminApi } from '../../utils/api';
import GenericCrudAdmin from './GenericCrudAdmin';

const fields = [
  { key: 'titleAr', label: 'Title (Arabic)', dir: 'rtl' },
  { key: 'titleEn', label: 'Title (English)' },
  { key: 'descriptionAr', label: 'Description (Arabic)', dir: 'rtl', textarea: true },
  { key: 'descriptionEn', label: 'Description (English)', textarea: true },
  { key: 'attendeesCount', label: 'Attendees Count' },
  { key: 'year', label: 'Year' },
  { key: 'order', label: 'Order', type: 'number', default: 0 },
  { key: 'isVirtual', label: 'Virtual Training', type: 'checkbox', default: false },
];

const TrainingAdmin = () => (
  <GenericCrudAdmin
    title="Training Programs"
    fetchFn={adminApi.getTraining}
    createFn={adminApi.createTraining}
    updateFn={adminApi.updateTraining}
    deleteFn={adminApi.deleteTraining}
    fields={[
      { key: 'titleAr', label: 'Title (Arabic)', dir: 'rtl', primary: true },
      { key: 'titleEn', label: 'Title (English)', secondary: true },
      { key: 'descriptionAr', label: 'Description (Arabic)', dir: 'rtl', rich: true },
      { key: 'descriptionEn', label: 'Description (English)', rich: true },
      { key: 'attendeesCount', label: 'Attendees' },
      { key: 'year', label: 'Year' },
      { key: 'order', label: 'Order', type: 'number', default: 0 },
    ]}
  />
);

export default TrainingAdmin;
