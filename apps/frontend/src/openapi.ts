export default {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "API"
  },
  "components": {
    "schemas": {},
    "parameters": {}
  },
  "paths": {
    "/players/{id}": {
      "get": {
        "operationId": "retrievePlayer",
        "summary": "Retrieve player",
        "tags": [
          "Players"
        ],
        "description": "Retrieve a player by ID",
        "parameters": [
          {
            "schema": {
              "type": "string"
            },
            "required": true,
            "name": "id",
            "in": "path"
          }
        ],
        "responses": {
          "200": {
            "description": "Retrieved player successfully.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "id": {
                      "type": "string",
                      "format": "uuid"
                    },
                    "address": {
                      "type": "string"
                    },
                    "lastMove": {
                      "type": "string"
                    },
                    "createdAt": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "id",
                    "address",
                    "lastMove",
                    "createdAt"
                  ]
                }
              }
            }
          }
        }
      }
    },
    "/players": {
      "post": {
        "operationId": "createPlayer",
        "summary": "Create player",
        "tags": [
          "Players"
        ],
        "description": "Create a player",
        "parameters": [
          {
            "schema": {
              "type": "string"
            },
            "required": true,
            "name": "address",
            "in": "path"
          }
        ],
        "responses": {
          "201": {
            "description": "Created player successfully.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "id": {
                      "type": "string",
                      "format": "uuid"
                    },
                    "address": {
                      "type": "string"
                    },
                    "lastMove": {
                      "type": "string"
                    },
                    "createdAt": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "id",
                    "address",
                    "lastMove",
                    "createdAt"
                  ]
                }
              }
            }
          }
        }
      }
    }
  }
} as const;