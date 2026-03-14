package com.anotherwhy.zero

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String = "zero"

  override fun onCreate(savedInstanceState: Bundle?) {
    // Pass null to prevent Android from restoring fragments after the OS
    // kills the app in the background. react-native-screens does not
    // support fragment restoration and will crash with IllegalStateException.
    super.onCreate(null)
  }

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
