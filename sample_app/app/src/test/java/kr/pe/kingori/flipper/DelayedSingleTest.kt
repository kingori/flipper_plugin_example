package kr.pe.kingori.flipper

import io.reactivex.Single
import org.junit.Assert
import org.junit.Test
import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit

class DelayedSingleTest {
    @Test
    fun delayedSingle() {
        val startTime =System.currentTimeMillis()
        val lock = CountDownLatch(1)
        Single.create<String> { e ->
            e.onSuccess("msg")
        }
            .delay(2, TimeUnit.SECONDS)
            .repeat(5)
            .subscribe( {
                println( System.currentTimeMillis().toString()+":"+ it)
            }, {}, {
                lock.countDown()
            })

        lock.await()

        val elapsed = System.currentTimeMillis() - startTime

        Assert.assertTrue( (elapsed / 1000 )>= 10)

    }


}