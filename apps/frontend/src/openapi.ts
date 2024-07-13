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
                    "challenge": {
                      "type": "string"
                    },
                    "signatureVerified": {
                      "type": "boolean",
                      "nullable": true
                    },
                    "worldcoinVerified": {
                      "type": "boolean",
                      "nullable": true
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
                    "challenge",
                    "signatureVerified",
                    "worldcoinVerified",
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
        "operationId": "verifyWorldIdPlayer",
        "summary": "Verify WORLDID player",
        "tags": [
          "Players"
        ],
        "description": "Verify worldID player signature",
        "parameters": [
          {
            "schema": {
              "type": "string",
              "example": "Bearer SECRET"
            },
            "required": true,
            "name": "authorization",
            "in": "header"
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "worldCoinSignature": {
                    "nullable": true
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Verified player successfully.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "ok": {
                      "type": "boolean"
                    }
                  },
                  "required": [
                    "ok"
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
    },
    "/games/{gameId}/players/{playerId}/moves": {
      "post": {
        "operationId": "createMove",
        "summary": "Create move",
        "tags": [
          "Moves"
        ],
        "description": "Create a move",
        "parameters": [
          {
            "schema": {
              "type": "string"
            },
            "required": true,
            "name": "gameId",
            "in": "path"
          },
          {
            "schema": {
              "type": "string"
            },
            "required": true,
            "name": "playerId",
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
                  }
                },
                "required": [
                  "xCoordinate",
                  "yCoordinate"
                ]
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created move successfully.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "id": {
                      "type": "string",
                      "format": "uuid"
                    },
                    "playerId": {
                      "type": "string",
                      "format": "uuid"
                    },
                    "xCoordinate": {
                      "type": "number"
                    },
                    "yCoordinate": {
                      "type": "number"
                    },
                    "createdAt": {
                      "type": "string"
                    },
                    "winnerId": {
                      "type": "string",
                      "nullable": true
                    },
                    "status": {
                      "type": "string",
                      "enum": [
                        "ongoing",
                        "finished"
                      ]
                    }
                  },
                  "required": [
                    "id",
                    "playerId",
                    "xCoordinate",
                    "yCoordinate",
                    "createdAt",
                    "winnerId",
                    "status"
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