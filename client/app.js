'use strict';

require('./bootstrap');

require('../node_modules/angular/angular.min.js');

require('../node_modules/angular-route/angular-route.min.js');
require('../node_modules/angular-animate/angular-animate.min.js');
require('../node_modules/angular-aria/angular-aria.min.js');
require('../node_modules/angular-sanitize/angular-sanitize.min.js');
require('../node_modules/angular-material/angular-material.min.js');
require('../node_modules/angular-bootstrap/ui-bootstrap-tpls.js');
require('../node_modules/ngstorage/ngStorage.min.js');
require('../node_modules/angular-input-masks/src/angular-input-masks.br.js');
require('../node_modules/angular-moment/angular-moment.js');
require('./custom-libs/angular-chrono.min.js');
require('./custom-libs/angular-locale_pt-br.js');
require('./custom-libs/moment-locale_pt-br.js');

var appModule = require('./common/appModule.js');

require('./common/services/token-interceptor');
require('./common/services/RunningAppointmentService');
require('./common/services/UserService');
require('./common/services/OptionsService');
require('./common/services/UtilService');
require('./appointment/services/AppointmentService');
require('./login/services/LoginService');

require('./components/nav/nav.component');

require('./launcher/controllers/LauncherCtrl');
require('./login/controllers/LoginCtrl');
require('./welcome/controllers/WelcomeCtrl');
require('./day/controllers/DayCtrl');
require('./timer/controllers/TimerCtrl');
//require('./appointment/controllers/AppointmentCtrl');
require('./new-appointment/controllers/NewAppointmentCtrl');