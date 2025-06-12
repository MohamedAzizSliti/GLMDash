# Mise en Prod : 
- prepare domain that point to racine project for example gold_gps
- ng build --base-href /admin/ --deploy-url /admin/public/_angular_ui/
- in index.html change the directory from "assets/css/remixicon.css" to "/admin/public/assets/css/remixicon.css"
- make assets directory under admin/public
- make an .htacces in the root of folder admin (see an example one the server)
- add another inside public folder (see an example one the server)
- in config/filesystem.php and change
  'public' => [
  'driver' => 'local',
  'root' => storage_path('app/public'),
  'url' => env('APP_URL').'/admin/storage',
  'visibility' => 'public',
  'throw' => false,
  ],
- in routes/web.php
// access to ressource puisque on'a mis le backend sous subdirectory admin
  Route::get('/admin/storage/{file}', function ($file) {
  $path = storage_path('app/public/' . $file);

  if (file_exists($path)) {
  return response()->file($path);
  }

  abort(404);
  });
- in RouteServiceProvider add prefix admin
  Route::middleware('api')
  ->prefix('admin/api/backend')
  ->group(base_path('routes/backend.php'));
# Call Back Event Traccar Event
- Edit the /opt/traccar/conf/traccar.xml
-  <entry key='event.forward.url'>https://gold-gps.bensassiridha.com/api/traccar/events</entry>
- sudo systemctl restart traccar

# Configure new device 
## SEND CMD
- send message to the number 
IP,123456,146.59.158.95,5023
- Pour Tracker un tél mobile => use app Traccar client > url Server : https://gps-server.bensassiridha.com  
- pour l'ajouter dans Traccar Server : add device and enter the the 'identifiant appareil' qui se trouve dans l'app TraccarClient
"# GLMDash" 
