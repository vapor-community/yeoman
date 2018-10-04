// swift-tools-version:4.1
import PackageDescription

let package = Package(
    name: "<%=name%>",
    dependencies: [
        .package(url: "https://github.com/vapor/vapor.git", from: "3.0.0"),<% if (fluent) { %>
        .package(url: "https://github.com/vapor/fluent-<%=fluentdb.toLowerCase()%>.git", from: "<%=fluentdbversion%>")<% } %>
    ],
    targets: [
        .target(name: "App", dependencies: [<% if (fluent) { %>
            "Fluent<%=fluentdb%>",<% } %>
            "Vapor"
        ]),
        .target(name: "Run", dependencies: ["App"]),
        .testTarget(name: "AppTests", dependencies: ["App"])
    ]
)