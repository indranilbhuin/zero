# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# ==========================================
# React Native
# ==========================================
-keep,allowobfuscation @interface com.facebook.proguard.annotations.DoNotStrip
-keep,allowobfuscation @interface com.facebook.proguard.annotations.KeepGettersAndSetters
-keep,allowobfuscation @interface com.facebook.common.internal.DoNotStrip
-keep,allowobfuscation @interface com.facebook.jni.annotations.DoNotStrip

# Do not strip any method/class that is annotated with @DoNotStrip
-keep @com.facebook.proguard.annotations.DoNotStrip class *
-keep @com.facebook.common.internal.DoNotStrip class *
-keep @com.facebook.jni.annotations.DoNotStrip class *
-keepclassmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
    @com.facebook.common.internal.DoNotStrip *;
    @com.facebook.jni.annotations.DoNotStrip *;
}

-keepclassmembers @com.facebook.proguard.annotations.KeepGettersAndSetters class * {
  void set*(***);
  *** get*();
}

-keep class * extends com.facebook.react.bridge.JavaScriptModule { *; }
-keep class * extends com.facebook.react.bridge.NativeModule { *; }
-keepclassmembers,includedescriptorclasses class * { native <methods>; }
-keepclassmembers class *  { @com.facebook.react.uimanager.annotations.ReactProp <methods>; }
-keepclassmembers class *  { @com.facebook.react.uimanager.annotations.ReactPropGroup <methods>; }

# Hermes
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# ==========================================
# WatermelonDB
# ==========================================
-keep class com.nozbe.watermelondb.** { *; }

# ==========================================
# React Native Reanimated
# ==========================================
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# ==========================================
# React Native Gesture Handler
# ==========================================
-keep class com.swmansion.gesturehandler.** { *; }
-keep class com.swmansion.gesturehandler.react.** { *; }

# ==========================================
# React Native MMKV
# ==========================================
-keep class com.mrousavy.mmkv.** { *; }

# ==========================================
# React Native Quick SQLite
# ==========================================
-keep class com.reactnativequicksqlite.** { *; }

# ==========================================
# React Native Screens
# ==========================================
-keep class com.swmansion.rnscreens.** { *; }

# ==========================================
# React Native SVG
# ==========================================
-keep public class com.horcrux.svg.** { *; }

# ==========================================
# Lucide Icons (React Native SVG based)
# ==========================================
-keep class com.horcrux.svg.** { *; }

# ==========================================
# AsyncStorage
# ==========================================
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# ==========================================
# DateTimePicker
# ==========================================
-keep class com.reactcommunity.rndatetimepicker.** { *; }

# ==========================================
# Document Picker
# ==========================================
-keep class com.reactnativedocumentpicker.** { *; }

# ==========================================
# File System (RNFS)
# ==========================================
-keep class com.rnfs.** { *; }

# ==========================================
# Safe Area Context
# ==========================================
-keep class com.th3rdwave.safeareacontext.** { *; }

# ==========================================
# Actions Sheet
# ==========================================
-keep class com.reactnativeactionssheet.** { *; }

# ==========================================
# Keep JavaScript interface methods
# ==========================================
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# ==========================================
# Optimization settings
# ==========================================
-optimizationpasses 5
-dontusemixedcaseclassnames
-verbose

# ==========================================
# Remove logging in release
# ==========================================
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int d(...);
    public static int i(...);
}

# ==========================================
# Keep source file names for crash reports
# ==========================================
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile
