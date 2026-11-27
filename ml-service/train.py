import os
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, precision_score, recall_score, f1_score

def train_and_save_model():
    print("Generating simulated historical dataset of 10,000 orders...")
    np.random.seed(42)
    n_samples = 10000

    item_counts = np.random.randint(1, 10, size=n_samples)
    hours = np.random.randint(6, 24, size=n_samples)
    store_loads = np.random.uniform(0.5, 1.8, size=n_samples)
    aisle_spreads = np.random.randint(1, 7, size=n_samples)
    is_peaks = np.array([1 if (8 <= h <= 10 or 18 <= h <= 22) else 0 for h in hours])
    is_juniors = np.random.binomial(1, 0.25, size=n_samples)
    is_seniors = np.random.binomial(1, 0.35, size=n_samples)
    is_rains = np.random.binomial(1, 0.10, size=n_samples)

    # Ground truth logistic probability
    logits = (
        -3.2
        + (item_counts - 3) * 0.28
        + (aisle_spreads - 2) * 0.35
        + is_peaks * 0.75
        + (store_loads - 1.0) * 0.95
        + is_juniors * 0.65
        - is_seniors * 0.45
        + is_rains * 1.15
    )
    probs = 1.0 / (1.0 + np.exp(-logits))
    labels = np.random.binomial(1, probs)

    X = np.column_stack([
        item_counts,
        hours,
        store_loads,
        aisle_spreads,
        is_peaks,
        is_juniors,
        is_seniors,
        is_rains
    ])
    y = labels

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Fitting Random Forest Classifier...")
    clf = RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42)
    clf.fit(X_train, y_train)

    y_pred = clf.predict(X_test)
    y_pred_proba = clf.predict_proba(X_test)[:, 1]

    roc_auc = roc_auc_score(y_test, y_pred_proba)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)

    print(f"Model Evaluation Metrics:")
    print(f"ROC AUC: {roc_auc:.3f}")
    print(f"Precision: {precision:.3f}")
    print(f"Recall: {recall:.3f}")
    print(f"F1 Score: {f1:.3f}")

    model_path = os.path.join(os.path.dirname(__file__), "model.joblib")
    joblib.dump(clf, model_path)
    print(f"Model saved successfully to {model_path}")

if __name__ == "__main__":
    train_and_save_model()
