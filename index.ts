import { registerRootComponent } from "expo";
import App from "./src/App";
import * as serviceWorkerRegistration from './src/utils/serviceWorkerRegistration';

registerRootComponent(App);

// Register service worker for PWA support on web
serviceWorkerRegistration.register();