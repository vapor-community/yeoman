<% if (fluent) { %>import Fluent<%=fluentdb%>
<% } %>import Vapor

/// Called before your application initializes.
public func configure(_ config: inout Config, _ env: inout Environment, _ services: inout Services) throws {
    <% if (fluent) { %>/// Register providers first
    try services.register(Fluent<%=fluentdb%>Provider())

    <% } %>/// Register routes to the router
    services.register(Router.self) { c -> EngineRouter in 
        let router = EngineRouter.default()
        try routes(router, c)
        return router
    }

    /// Register middleware
    services.register { c -> MiddlewareConfig in
        var middlewares = MiddlewareConfig() // Create _empty_ middleware config
        /// middlewares.use(FileMiddleware.self) // Serves files from `Public/` directory
        middlewares.use(ErrorMiddleware.self) // Catches errors and converts to HTTP response
        return middlewares
    }<% if (fluent) { %>

    /// Configure a <%=fluentdb%> database
    services.register { c -> <%=fluentdb%>Database in<% if (fluentdb == 'SQLite') { %>
        return try <%=fluentdb%>Database(storage: .memory)<% } else { %>
        return try <%=fluentdb%>Database(config: c.make())<% } %>
    }

    /// Register the configured <%=fluentdb%> database to the database config.
    services.register { c -> DatabasesConfig in
        var databases = DatabasesConfig()
        try databases.add(database: c.make(<%=fluentdb%>Database.self), as: .<%=fluentdbshort%>)
        return databases
    }

    /// Configure migrations
    services.register { c -> MigrationConfig in
        var migrations = MigrationConfig()
        migrations.add(model: Todo.self, database: .<%=fluentdbshort%>)
        return migrations
    }<% } %>
}
