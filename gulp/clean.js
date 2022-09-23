import {deleteAsync} from 'del';

export default path => deleteAsync(path, {force: true});
