import { adminApi } from '../../utils/api';
import GenericCrudAdmin from './GenericCrudAdmin';

const PartnersAdmin = () => (
  <GenericCrudAdmin
    title="Partners"
    fetchFn={adminApi.getPartners}
    createFn={adminApi.createPartner}
    updateFn={adminApi.updatePartner}
    deleteFn={adminApi.deletePartner}
    imageField="logo"
    imageFolder="kwa/partners"
    fields={[
      { key: 'nameAr', label: 'Name (Arabic)', dir: 'rtl', primary: true },
      { key: 'nameEn', label: 'Name (English)', secondary: true },
      {
        key: 'category', label: 'Category', type: 'select', default: 'government',
        options: [
          { value: 'government', label: 'Government' },
          { value: 'international', label: 'International' },
          { value: 'research', label: 'Research' },
          { value: 'civil', label: 'Civil Society & Private Sector' },
        ]
      },
      { key: 'order', label: 'Order', type: 'number', default: 0 },
    ]}
  />
);

export default PartnersAdmin;
