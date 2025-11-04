import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';

const API_BASE_URL = 'https://zx991pwv31.execute-api.eu-north-1.amazonaws.com/dev';

async function getAuthToken() {
    try {
        const session = await fetchAuthSession();
        return session.tokens?.idToken?.toString();
    } catch (err) {
        console.error('Not authenticated', err);
        return null;
    }
}

async function getUserId() {
    try {
        const user = await getCurrentUser();
        return user.username; // This will be used for unique shopId assigned to user
    } catch (err) {
        console.error('Could not get user', err);
        return null;
    }
}

export async function getProducts(shopId) {
    const token = await getAuthToken();
    const res = await fetch(`${API_BASE_URL}/products?shopId=${shopId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token || '',
        },
    });
    if(!res.ok) throw new Error('Failed to fetch products');
    return res.json();
}

export async function addProduct(product) {
    const token = await getAuthToken();
    const res = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token || '',
        },
        body: JSON.stringify(product),
    });
    if(!res.ok) throw new Error('Failed to add product');
    return res.json();
}
export async function updateProduct(productId, shopId, updates) {
    const token = await getAuthToken();
    const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: token || "",
        },
        body: JSON.stringify({ ...updates, shopId }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export async function deleteProduct(productId, shopId) {
    const token = await getAuthToken();
    const res = await fetch(`${API_BASE_URL}/products/${productId}?shopId=${shopId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token || "",
        },
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

