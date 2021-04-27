const config = {};
config.ami = {};
config.context = {};
config.db = {};


//Данные для подключения к AMI Asterisk
config.ami.username = 'amiuser';
config.ami.secret = 'hI7eR8pP9lM8zE7g';
config.ami.host = 'localhost';
config.ami.port = 5038;

//Хендлер по завершению вызова
config.context.handlerOutgoingCall = 'call-hangup-handler';
config.context.crmBridgeLocal3CX = "crm-3cx";
config.context.crmBridgeExternal3CX = "crm-external";



//Данные для подключения к БД 3CX
config.db.host = '127.0.0.1';
config.db.port = 5432;
config.db.database = 'asteriskcdrdb';
config.db.user = 'asterisk';
config.db.password = 'eK4jI4qZ1kZ8tL9c';

module.exports = config;