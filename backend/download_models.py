import gdown
import os

def download_model(file_id, output_file):
    if not os.path.exists(output_file):
        url = f"https://drive.google.com/uc?id={file_id}"
        gdown.download(url, output_file, quiet=False)
        print(f"Downloaded {output_file}")
    else:
        print(f"{output_file} already exists, skipping download")

# Dictionary of model names and their Google Drive file IDs
models = {
    'regression_model.joblib': '107E7jlaOCO79235FhZTmT_BjAKCfK5n1',
    'classification_model.joblib': '1Oyzy8rvw5HgtCgGhfAvv2ifebop-9WDt',
    'gradient_boosting_model.joblib': '1CPZT5og6-GUJTo99Rqp0EQiHG_59xIkQ',
    'kmeans_model.joblib': '1H_m2rWCakZwMITbcCoXPMEBmMKEBvi90',
    'preprocessor.joblib': '1s7Bs_Gfc3VlBwcg23xJ_xycaY6Cf6J3j'
}

def download_all_models():
    for model_name, file_id in models.items():
        download_model(file_id, model_name)

if __name__ == "__main__":
    download_all_models()   