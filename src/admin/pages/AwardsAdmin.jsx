import { adminApi } from '../../utils/api';
import GenericCrudAdmin from './GenericCrudAdmin';

const AwardsAdmin = () => (
  <GenericCrudAdmin
    title="Awards"
    fetchFn={adminApi.getAwards}
    createFn={adminApi.createAward}
    updateFn={adminApi.updateAward}
    deleteFn={adminApi.deleteAward}
    imageField="image"
    imageFolder="kwa/awards"
    fields={[
      { key: 'titleAr', label: 'Title (Arabic)', dir: 'rtl', primary: true },
      { key: 'titleEn', label: 'Title (English)', secondary: true },
      { key: 'descriptionAr', label: 'Description (Arabic)', dir: 'rtl', rich: true },
      { key: 'descriptionEn', label: 'Description (English)', rich: true },
      { key: 'year', label: 'Year' },
      { key: 'order', label: 'Order', type: 'number', default: 0 },
    ]}
  />
);

export default AwardsAdmin;
