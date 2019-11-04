package kr.pe.kingori.flipper

import android.app.Application
import com.facebook.flipper.android.AndroidFlipperClient
import com.facebook.flipper.android.utils.FlipperUtils
import com.facebook.flipper.core.FlipperConnection
import com.facebook.flipper.core.FlipperPlugin
import com.facebook.flipper.plugins.databases.DatabasesFlipperPlugin
import com.facebook.flipper.plugins.inspector.DescriptorMapping
import com.facebook.flipper.plugins.inspector.InspectorFlipperPlugin
import com.facebook.flipper.plugins.sharedpreferences.SharedPreferencesFlipperPlugin
import com.facebook.soloader.SoLoader
import kr.pe.kingori.flipper.plugin.EchoPlugin

class FlipperSampleApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        SoLoader.init(this, false)

        if (BuildConfig.DEBUG && FlipperUtils.shouldEnableFlipper(this)) {
            val client = AndroidFlipperClient.getInstance(this)
            client.addPlugin(
                InspectorFlipperPlugin(
                    this@FlipperSampleApplication,
                    DescriptorMapping.withDefaults()
                )
            )
            client.addPlugin(SharedPreferencesFlipperPlugin(this@FlipperSampleApplication))
            client.addPlugin(DatabasesFlipperPlugin(this@FlipperSampleApplication))
            client.addPlugin(object : FlipperPlugin {
                override fun onConnect(connection: FlipperConnection?) {}
                override fun runInBackground() = true
                override fun getId() = "helloworld"
                override fun onDisconnect() {}
            })
            client.addPlugin(object : FlipperPlugin {
                override fun onConnect(connection: FlipperConnection?) {}
                override fun runInBackground() = true
                override fun getId() = "ui_showcase"
                override fun onDisconnect() {}
            })
            client.addPlugin(EchoPlugin())

            client.start()
        }
    }
}