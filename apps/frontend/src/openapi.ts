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
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "address": {
                    "type": "string"
                  }
                },
                "required": [
                  "address"
                ]
              }
            }
          }
        },
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
    },
    "/games/{id}": {
      "get": {
        "operationId": "retrieveGame",
        "summary": "Retrieve game",
        "tags": [
          "Games"
        ],
        "description": "Retrieve a game by ID",
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
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "xCoordinate": {
                    "type": "number"
                  },
                  "yCoordinate": {
                    "type": "number"
                  },
                  "size": {
                    "type": "number"
                  }
                },
                "required": [
                  "xCoordinate",
                  "yCoordinate",
                  "size"
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Retrieved game successfully.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "id": {
                      "type": "string",
                      "format": "uuid"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ongoing",
                        "finished"
                      ]
                    },
                    "winnerId": {
                      "type": "string",
                      "nullable": true,
                      "format": "uuid"
                    },
                    "createdAt": {
                      "type": "string"
                    },
                    "updatedAt": {
                      "type": "string"
                    },
                    "map": {
                      "type": "array",
                      "items": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "playerAddress": {
                              "type": "string",
                              "nullable": true
                            }
                          },
                          "required": [
                            "playerAddress"
                          ]
                        }
                      }
                    }
                  },
                  "required": [
                    "id",
                    "status",
                    "winnerId",
                    "createdAt",
                    "updatedAt",
                    "map"
                  ]
                }
              }
            }
          }
        }
      }
    },
    "/games": {
      "get": {
        "operationId": "listGames",
        "summary": "List games",
        "tags": [
          "Games"
        ],
        "description": "List all games",
        "responses": {
          "200": {
            "description": "Listed games successfully.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "status": {
                        "type": "string",
                        "enum": [
                          "ongoing",
                          "finished"
                        ]
                      },
                      "winnerId": {
                        "type": "string",
                        "nullable": true,
                        "format": "uuid"
                      },
                      "createdAt": {
                        "type": "string"
                      },
                      "updatedAt": {
                        "type": "string"
                      }
                    },
                    "required": [
                      "id",
                      "status",
                      "winnerId",
                      "createdAt",
                      "updatedAt"
                    ]
                  }
                }
              }
            }
          }
        }
      },
      "post": {
        "operationId": "createGame",
        "summary": "Create game",
        "tags": [
          "Games"
        ],
        "description": "Create a game",
        "responses": {
          "201": {
            "description": "Created game successfully.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "id": {
                      "type": "string",
                      "format": "uuid"
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ongoing",
                        "finished"
                      ]
                    },
                    "winnerId": {
                      "type": "string",
                      "nullable": true,
                      "format": "uuid"
                    },
                    "createdAt": {
                      "type": "string"
                    },
                    "updatedAt": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "id",
                    "status",
                    "winnerId",
                    "createdAt",
                    "updatedAt"
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