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
    "/players/{address}": {
      "get": {
        "operationId": "retrievePlayerByAddress",
        "summary": "Retrieve player",
        "tags": [
          "Players"
        ],
        "description": "Retrieve a player by address",
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
    "/players/connect": {
      "post": {
        "operationId": "connectPlayer",
        "summary": "Connect player",
        "tags": [
          "Players"
        ],
        "description": "Connect player",
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
    "/players/verify-signature": {
      "post": {
        "operationId": "verifyPlayerSignature",
        "summary": "Verify player",
        "tags": [
          "Players"
        ],
        "description": "Verify player signature",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "address": {
                    "type": "string"
                  },
                  "signature": {
                    "type": "string"
                  }
                },
                "required": [
                  "address",
                  "signature"
                ]
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
                    "token": {
                      "type": "string"
                    },
                    "player": {
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
                  },
                  "required": [
                    "token",
                    "player"
                  ]
                }
              }
            }
          }
        }
      }
    },
    "/players/verify-worldcoin": {
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
    "/players/payment-signature": {
      "post": {
        "operationId": "requestPaymentSignature",
        "summary": "Request payment signature",
        "tags": [
          "Players"
        ],
        "description": "Request a signature for a player playing",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "senderAddress": {
                    "type": "string"
                  },
                  "transferContractAddress": {
                    "type": "string"
                  }
                },
                "required": [
                  "senderAddress",
                  "transferContractAddress"
                ]
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Requested payment signature successfully.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "id": {
                      "type": "string"
                    },
                    "signature": {
                      "type": "string"
                    },
                    "deadline": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "id",
                    "signature",
                    "deadline"
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
                        "type": "string"
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
                        "nullable": true
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
                      "type": "string"
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
                      "nullable": true
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