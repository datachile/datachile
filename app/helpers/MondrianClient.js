import { Client as MondrianClient } from 'mondrian-rest-client';

//const ENDPOINT = "http://hermes:5000";
const ENDPOINT = "http://localhost:9292";
const client = new MondrianClient(ENDPOINT);
export default client;
