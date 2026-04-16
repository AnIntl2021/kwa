import { adminApi } from '../../utils/api';
import GenericCrudAdmin from './GenericCrudAdmin';

const MembershipsAdmin = () => (
  <GenericCrudAdmin
    title="Memberships"
    fetchFn={adminApi.getMemberships}
    createFn={adminApi.createMembership}
    updateFn={adminApi.updateMembership}
    deleteFn={adminApi.deleteMembership}
    fields={[
      { key: 'titleAr', label: 'Title (Arabic)', dir: 'rtl', primary: true, textarea: true, fullWidth: true },
      { key: 'titleEn', label: 'Title (English)', secondary: true, textarea: true, fullWidth: true },
      { key: 'year', label: 'Year' },
      { key: 'order', label: 'Order', type: 'number', default: 0 },
    ]}
  />
);

export default MembershipsAdmin;
