# Models.minimumloss.xyz

This is a house for all the models that I've trained. This is a react router project, with the following pages. Each of these pages basically render the files in the folders in the backend:

```
project/  
├── / -> get all models, along with metadata.json of each model  
├── /{modelSlug}/definition   -> MODEL_DEFINITION.py    
├── /{modelSlug}/dataset  -> DATASET.md   
├── /{modelSlug}/training-code  -> TRAINING_CODE.py file  
├── /{modelSlug}/eval-results  -> EVAL_RESULTS.log   
```



### Data Models
modelSlug is used as the unique identifier in all frontend and backend routes. This slug is generated in the backend repo from the folder names. It follows the following convention:
e.g. `1_MNISTFashion_shallowNN_18FEB26`

{modelId_dataset_model_date}

### Starting the project:
`npm run dev`

### Building/starting:
`npm run build`

`npm run start`

