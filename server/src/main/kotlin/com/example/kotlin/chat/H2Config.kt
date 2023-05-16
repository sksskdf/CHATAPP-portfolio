package com.example.kotlin.chat

import org.h2.tools.Server
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.event.ContextClosedEvent
import org.springframework.context.event.ContextRefreshedEvent
import org.springframework.context.event.EventListener
import org.springframework.stereotype.Component
import kotlin.jvm.Throws

@Component
class H2Config {
    @Value("\${h2.console.port}")
    private val port: Int? = null
    private var webServer: Server? = null

    @EventListener(ContextRefreshedEvent::class)
    @Throws(java.sql.SQLException::class)
    fun start() {
        log.info("started h2 console at port {}.", port)
        webServer = Server.createWebServer("-webPort", port.toString()).start()
    }

    @EventListener(ContextClosedEvent::class)
    fun stop() {
        log.info("stopped h2 console at port{}.", port)
        webServer?.stop()
    }

    companion object {
        private val log = LoggerFactory.getLogger(H2Config::class.java)
    }
}