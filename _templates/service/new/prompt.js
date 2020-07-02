const { upper } = require("change-case");
const inflection = require("inflection");

const sequelizeTypes = [
  "string",
  "char",
  "text",
  "uuid",
  "integer",
  "bigint",
  "float",
  "real",
  "double",
  "decimal",
  "boolean",
  "time",
  "date",
  "dateonly",
  "enum",
  "json",
  "jsonb",
  "array",
];

const validateFieldNameType = (type) => {
  return sequelizeTypes.some((sequelizeType) => sequelizeType.value === type);
};

const modelTypeMap = (type) => {
  switch (type) {
    case "string":
    case "char":
      return "STRING";
    case "text":
      return "TEXT";
    case "uuid":
      return "UUID";
    case "integer":
      return "INTEGER";
    case "bigint":
      return "BIGINT";
    case "real":
      return "REAL";
    case "double":
      return "DOUBLE";
    case "decimal":
      return "DECIMAL";
    case "float":
      return "FLOAT";
    case "boolean":
      return "BOOLEAN";
    case "time":
    case "date":
    case "dateonly":
      return "DATE";
    case "enum":
      return "ENUM";
    case "json":
    case "jsonb":
      return "JSONB";
    case "array":
      return "ARRAY(DataTypes.STRING)";
    default:
      return type;
  }
};

const paramValidationTypeMap = (type) => {
  switch (type) {
    case "string":
    case "char":
    case "text":
      return "string";
    case "uuid":
      return "uuid";
    case "integer":
    case "bigint":
    case "real":
    case "double":
    case "decimal":
    case "float":
      return "number";
    case "boolean":
      return "boolean";
    case "time":
    case "date":
    case "dateonly":
      return "date";
    case "enum":
      return "enum";
    case "json":
    case "jsonb":
      return "object";
    case "array":
      return "array";
    default:
      return type;
  }
};

const typescriptTypeMap = (type) => {
  switch (type) {
    case "string":
    case "char":
    case "text":
    case "uuid":
      return "String";
    case "integer":
    case "bigint":
    case "real":
    case "double":
    case "decimal":
    case "float":
      return "Number";
    case "boolean":
      return "Boolean";
    case "time":
    case "date":
    case "dateonly":
      return "Date";
    case "enum":
      return "Enum";
    case "json":
    case "jsonb":
      return "object";
    //NOTE: Not sure how to handle below
    case "array":
      return "Array";
    default:
      return "ERROR: NEED TO MANUALLY FIX";
  }
};

const gqlTypeMap = (type) => {
  switch (type) {
    case "string":
    case "char":
    case "text":
    case "uuid":
      return "String";
    case "integer":
    case "bigint":
    case "real":
    case "double":
    case "decimal":
      return "Int";
    case "float":
      return "Float";
    case "boolean":
      return "Boolean";
    case "time":
    case "date":
    case "dateonly":
      return "Date";
    case "enum":
      return "Enum";
    case "json":
    case "jsonb":
      return "JSON";
    //NOTE: Not sure how to handle below
    case "array":
      return "list";
    default:
      return type;
  }
};
const logError = (message) => {
  console.log("Error:", message);
};

module.exports = {
  prompt: async ({ prompter }) => {
    let responsePayload = {};

    // defining questions in arrays ensures all questions are asked before next prompt is executed
    const questions = [
      {
        type: "input",
        name: "name",
        message: "Name of service? (non-plural)",
      },
      {
        type: "confirm",
        name: "shouldExposeOnPort",
        message: "Expose service on port?",
        onAnswer: async (value) => {
          if (value == true) {
            const { port } = await prompter.prompt({
              type: "input",
              name: "port",
              message: "Which port to run on?",
            });

            return {
              port,
            };
          }
          // Object to merge back to parent answer object
          return {};
        },
      },
      {
        type: "confirm",
        name: "shouldUseSubPath",
        message: "Should it be exposed on a certain path other than '/'?",
        onAnswer: async (value) => {
          if (value == true) {
            const { path } = await prompter.prompt({
              type: "input",
              name: "path",
              message: "Which path from the root domain?",
            });

            return {
              path,
            };
          }
          // Object to merge back to parent answer object
          return {};
        },
      },
      {
        type: "confirm",
        name: "shouldAddDb",
        message: "Does this service need a db?",
        onAnswer: async (value) => {
          if (value == true) {
            let finishedDbAnnotation = false;
            let dbTypeMap = {};
            let enumTypeMap = {};
            while (finishedDbAnnotation === false) {
              const { fieldName } = await prompter.prompt({
                type: "input",
                name: "fieldName",
                message: "Db field name? (ex: `name`)",
              });

              if (fieldName === null || (fieldName && fieldName.length === 0)) {
                logError("Must provide field name");
              } else {
                const { fieldType } = await prompter.prompt({
                  type: "autocomplete",
                  name: "fieldType",
                  message:
                    "Db field type? (ex: `string`) *Sequelize schema type*",
                  choices: sequelizeTypes,
                });

                let enumTypes = null;
                if (fieldType == "enum") {
                  const response = await prompter.prompt({
                    type: "input",
                    name: "enumTypes",
                    message:
                      "Please provide enum values (ex: pending,started,complete)",
                    validate: (value) => {
                      return value && value.indexOf(",") > -1;
                    },
                  });

                  enumTypes = response.enumTypes;
                }

                if (
                  fieldType === null ||
                  (fieldType && fieldType.length === 0)
                ) {
                  logError(
                    "Must provide field type, starting over at field name."
                  );
                } else {
                  if (!validateFieldNameType(fieldType)) {
                    logError(
                      "Invalid type for Sequelize, restarting column definition."
                    );
                  } else {
                    const { allowNull } = await prompter.prompt({
                      type: "confirm",
                      name: "allowNull",
                      message: "Is this field nullable?",
                    });

                    let defaultValue = null;

                    if (!allowNull) {
                      const { hasDefaultValue } = await prompter.prompt({
                        type: "confirm",
                        name: "hasDefaultValue",
                        message: "Should there be a default value?",
                      });

                      if (hasDefaultValue) {
                        if (fieldType == "enum") {
                          const { choosenDefaultValue } = await prompter.prompt(
                            {
                              type: "autocomplete",
                              name: "choosenDefaultValue",
                              message: "What should the default value be?",
                              choices: enumTypes
                                .split(",")
                                .map((value) =>
                                  upper(inflection.underscore(value, true))
                                ),
                            }
                          );

                          defaultValue = choosenDefaultValue;
                        } else if (fieldType == "boolean") {
                          const { choosenDefaultValue } = await prompter.prompt(
                            {
                              type: "autocomplete",
                              name: "choosenDefaultValue",
                              message: "What should the default value be?",
                              choices: ["true", "false"],
                            }
                          );

                          defaultValue = choosenDefaultValue;
                        } else {
                          const { choosenDefaultValue } = await prompter.prompt(
                            {
                              type: "input",
                              name: "choosenDefaultValue",
                              message: "What should the default value be?",
                            }
                          );

                          defaultValue = choosenDefaultValue;
                        }
                      }
                    }

                    dbTypeMap[fieldName] = {
                      dbType: fieldType,
                      modelType: modelTypeMap(fieldType),
                      paramValidationType: paramValidationTypeMap(fieldType),
                      typescriptType: typescriptTypeMap(fieldType),
                      gqlType: gqlTypeMap(fieldType),
                      defaultValue: defaultValue,
                      allowNull: allowNull,
                    };

                    if (enumTypes) {
                      enumTypeMap[fieldName] = {
                        enumTypes,
                      };
                    }

                    const { continueDbFieldEntry } = await prompter.prompt({
                      type: "confirm",
                      name: "continueDbFieldEntry",
                      message: "Continue db field entry?",
                    });

                    finishedDbAnnotation = !continueDbFieldEntry;
                  }
                }
              }
            }
            return {
              enumTypeMap,
              dbTypeMap,
            };
          }
          // Object to merge back to parent answer object
          return {};
        },
      },
    ];

    for (const question of questions) {
      const answer = await prompter.prompt(question);
      const value = answer[question.name];
      if (value) {
        if (question.onAnswer != null || question.onAnswer != undefined) {
          const mergeObject = await question.onAnswer(value);
          responsePayload = { ...responsePayload, ...mergeObject };
        }
      }

      responsePayload = { ...responsePayload, ...answer };
    }

    const nodeDebugPort =
      Math.floor(Math.random() * (Math.floor(9999) - Math.ceil(9033) + 1)) +
      9033;

    responsePayload = { ...responsePayload, nodeDebugPort };

    console.log(responsePayload);

    return responsePayload;
  },
};
