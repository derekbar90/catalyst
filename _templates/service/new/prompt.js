const validateFieldNameType = (type) => {
  switch (type) {
    case 'string':
    case 'uuid':
    case 'text':
    case 'bigInteger':
    case 'integer':
    case 'float':
    case 'decimal':
    case 'boolean':
    case 'date':
    case 'dateTime':
    case 'enum':
    case 'json':
      return true;
    defualt:
      return false;
  }
};

const logError = (message) => {
  console.log('Error:', message);
}

module.exports = {
  prompt: async ({ prompter }) => {

    let responsePayload = {};

    // defining questions in arrays ensures all questions are asked before next prompt is executed
    const questions = [
      {
        type: 'input',
        name: 'name',
        message: 'Name of service?',
      },
      {
        type: 'confirm',
        name: 'shouldExposeOnPort',
        message: 'Expose service on port?',
        onAnswer: async (value) => {
          if (value == true) {
            const {port} = await prompter.prompt({
              type: 'input',
              name: 'port',
              message: 'Which port to run on?',
            });

            return {
              port
            };
          }
          // Object to merge back to parent answer object
          return {};
        },
      },
      {
        type: 'confirm',
        name: 'shouldUseSubPath',
        message: 'Should it be exposed on a certain path other than \'/\'?',
        onAnswer: async (value) => {
          if (value == true) {
            const {path} = await prompter.prompt({
              type: 'input',
              name: 'path',
              message: 'Which path from the root domain?',
            });

            return {
              path
            };
          }
          // Object to merge back to parent answer object
          return {};
        },
      },
      {
        type: 'confirm',
        name: 'shouldAddDb',
        message: 'Does this service need a db?',
        onAnswer: async (value) => {
          if (value == true) {
            let finishedDbAnnotation = false;
            let dbTypeMap = {};
            while(finishedDbAnnotation === false) {
              const {fieldName} = await prompter.prompt({
                type: 'input',
                name: 'fieldName',
                message: 'Db field name? (ex: `id`)',
              });

              if (
                fieldName === null || 
                (fieldName && fieldName.length === 0)
              ) {
                
                logError('Must provide field name');
              
              } else {
              
                const {fieldType} = await prompter.prompt({
                  type: 'input',
                  name: 'fieldType',
                  message: 'Db field type? (ex: `uuid`) *knex schema type*',
                });

                if (
                  fieldType === null || 
                  (fieldType && fieldType.length === 0)
                ) { 
                  logError('Must provide field type, starting over at field name.');
                } else {
                  
                  if(!validateFieldNameType(fieldType)){
                    logError('Invalid type for knex');
                  };
    
                  dbTypeMap[fieldName] = fieldType;

                  const {continueDbFieldEntry} = await prompter.prompt({
                    type: 'confirm',
                    name: 'continueDbFieldEntry',
                    message: 'Continue db field entry?',
                  });
    
                  finishedDbAnnotation = !continueDbFieldEntry;
                }
              }
            }
            return {
              dbTypeMap
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
      
      responsePayload = { ...responsePayload, ...answer, nodeDebugPort };
    }

    const nodeDebugPort = Math.floor(Math.random() * (Math.floor(9999) - Math.ceil(9033) + 1)) + 9033;
    
    responsePayload = {...responsePayload, nodeDebugPort};

    return responsePayload;
  },
}