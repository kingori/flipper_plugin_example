package kr.pe.kingori.flipper.plugin

import com.facebook.flipper.core.FlipperConnection
import com.facebook.flipper.core.FlipperObject
import com.facebook.flipper.core.FlipperPlugin
import io.reactivex.Single
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.disposables.Disposable
import java.util.concurrent.TimeUnit

class EchoPlugin : FlipperPlugin {
    val disposables = CompositeDisposable()

    override fun onConnect(connection: FlipperConnection) {
        connection.receive("echo") { params, responder ->
            if (params.contains("msg") && (params.getString("msg")?.isNotBlank() == true) ) {
                val msg = params.getString("msg")

                responder.success(
                    FlipperObject.Builder()
                        .put("resp", "registered successfully")
                        .build()
                )

                Single.create<String> { e -> e.onSuccess(msg) }
                    .delay(2, TimeUnit.SECONDS)
                    .repeat(5)
                    .subscribe {
                        connection.send(
                            "message", FlipperObject.Builder()
                                .put("time", System.currentTimeMillis())
                                .put("msg", it)
                                .build()
                        )
                    }.bind()
            } else {
                responder.error(
                    FlipperObject.Builder()
                        .put("resp", "msg is required").build()
                )
            }
        }
    }

    override fun runInBackground() = true

    override fun getId() = "echo"

    override fun onDisconnect() {
        disposables.clear()
    }

    fun Disposable.bind() = disposables.add(this)
}

