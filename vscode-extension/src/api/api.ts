import { ITogezrAPI } from '../interfaces/ITogezrAPI';
import { ApiV1 } from './v1';

export class API implements ITogezrAPI {
    public v1 = new ApiV1();
}
