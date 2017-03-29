import { Client as MondrianClient } from 'mondrian-rest-client';
import {API} from ".env";

const client = new MondrianClient(API);
export default client;
