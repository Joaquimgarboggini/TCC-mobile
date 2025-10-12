// Arquivo: android/app/src/main/java/com/tactusapp/KeyboardModule.java

package com.tactusapp;

import android.view.KeyEvent;
import android.view.View;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class KeyboardModule extends ReactContextBaseJavaModule {
    private static final String MODULE_NAME = "KeyboardModule";
    
    public KeyboardModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }
    
    @Override
    public String getName() {
        return MODULE_NAME;
    }
    
    @ReactMethod
    public void startKeyboardListener() {
        // Implementar listener de teclado nativo
        // Este código capturaria eventos de teclado do sistema
    }
    
    // Método para enviar eventos para JavaScript
    private void sendKeyEvent(String key, boolean isPressed) {
        WritableMap params = Arguments.createMap();
        params.putString("key", key);
        params.putBoolean("pressed", isPressed);
        
        getReactApplicationContext()
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit("keyboardEvent", params);
    }
}

// Adicionar ao MainApplication.java:
// import com.tactusapp.KeyboardPackage;
// packages.add(new KeyboardPackage());