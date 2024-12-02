import requests
from urllib.parse import urlparse, parse_qs
from typing import Tuple, List
import time

def test_url_decryption(url: str) -> Tuple[bool, str]:
    """Test decryption for a complete URL with encrypted data."""
    try:
        # Parse the URL to get the encrypted data
        parsed_url = urlparse(url)
        query_params = parse_qs(parsed_url.query)
        encrypted_data = query_params.get('data', [None])[0]
        
        if not encrypted_data:
            return False, "No encrypted data found in URL"
            
        # Send POST request to test route
        response = requests.post(
            "http://localhost:3000/api/test-decrypt",
            json={'encryptedData': encrypted_data},
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        try:
            decrypted_data = response.json()
            print(decrypted_data)
        except requests.exceptions.JSONDecodeError:
            return False, f"Invalid JSON response: {response.text[:200]}..."
        
        if response.status_code != 200:
            return False, f"API Error: Status {response.status_code} - {response.text}"
            
        # Verify the decrypted data has the expected format
        if not isinstance(decrypted_data, dict) or 'node' not in decrypted_data or 'number' not in decrypted_data:
            return False, f"Invalid decrypted data format: {decrypted_data}"
            
        print(f"✓ Decrypted data: node={decrypted_data['node']}, number={decrypted_data['number']}")
        return True, "Success"
        
    except requests.exceptions.Timeout:
        return False, "Request timed out"
    except requests.exceptions.ConnectionError:
        return False, "Connection error - is the server running?"
    except Exception as e:
        return False, f"Error: {str(e)}"

def run_url_tests():
    """Test decryption for a list of complete URLs."""
    # Your existing URLs list here
    urls = ['https://astar-livesearch.vercel.app/check-route?data=MTIzNDU2Nzg5MDEyMzQ1NtjGqFLK6rDb7YZDHLnt35tKAWK69I9mXN8bXa5VF9J4', 'https://astar-livesearch.vercel.app/check-route?data=MTIzNDU2Nzg5MDEyMzQ1Nq-ZRNvTGEs3Uh9aGbgSEtOHZRj-_kx8UuZhz5GO62yc', 'https://astar-livesearch.vercel.app/check-route?data=MTIzNDU2Nzg5MDEyMzQ1NpHxbSCJVndswr3Q2Ca12KeObXfzSd_Ejbin9OF4XirV', 'https://astar-livesearch.vercel.app/check-route?data=MTIzNDU2Nzg5MDEyMzQ1Nl-7A0scc1CRuFlhTnpjJSeBQ3X4WhImcucq6ZaZVY__', 'https://astar-livesearch.vercel.app/check-route?data=MTIzNDU2Nzg5MDEyMzQ1NtQRD4n44wM-k2vJaAGHl5nPVsvHW-xo992BDVp-pz0-', 'https://astar-livesearch.vercel.app/check-route?data=MTIzNDU2Nzg5MDEyMzQ1NuOkiHQxcbkoSRmmVlaAZRMrozfsY122yj6lXlz1bi4g', 'https://astar-livesearch.vercel.app/check-route?data=MTIzNDU2Nzg5MDEyMzQ1NrgYJQRnnEKOfO_u0XUqRWAcWBDQT7V3HFGBKAu9t4VR', 'https://astar-livesearch.vercel.app/check-route?data=MTIzNDU2Nzg5MDEyMzQ1Ngs9K5iUeIQoiEH7DzQcVA0nOJxv6ywXrgreUa7-2DMO', 'https://astar-livesearch.vercel.app/check-route?data=MTIzNDU2Nzg5MDEyMzQ1NpqvzNx6Vj-GBEvoOmEX55S1QkR2RmSce217FSReMJrX', 'https://astar-livesearch.vercel.app/check-route?data=MTIzNDU2Nzg5MDEyMzQ1NoIoOz-oZ4cfDBoGtyUoIbPdOSrRtHHv7zhxI38eKOgh', 'https://astar-livesearch.vercel.app/check-route?data=MTIzNDU2Nzg5MDEyMzQ1NtjGqFLK6rDb7YZDHLnt35s_WynjohiVimirA3Jd2UTm', 'https://astar-livesearch.vercel.app/check-route?data=MTIzNDU2Nzg5MDEyMzQ1Nq-ZRNvTGEs3Uh9aGbgSEtN0FL7oj_qnsEI6bIKcClaB', 'https://astar-livesearch.vercel.app/check-route?data=MTIzNDU2Nzg5MDEyMzQ1NpHxbSCJVndswr3Q2Ca12Kc6gyQ9ApjxP0lm4a7qXaSD', 'https://astar-livesearch.vercel.app/check-route?data=MTIzNDU2Nzg5MDEyMzQ1Nl-7A0scc1CRuFlhTnpjJSdnGFEfloJc5HEQgGDPpvsD', 'https://astar-livesearch.vercel.app/check-route?data=MTIzNDU2Nzg5MDEyMzQ1NtQRD4n44wM-k2vJaAGHl5kzeY8mdyMcYEeuKHyorxA-', 'https://astar-livesearch.vercel.app/check-route?data=MTIzNDU2Nzg5MDEyMzQ1NuOkiHQxcbkoSRmmVlaAZRM_ib7lMZc6_M-8Jx_7UCZm', 'https://astar-livesearch.vercel.app/check-route?data=MTIzNDU2Nzg5MDEyMzQ1NrgYJQRnnEKOfO_u0XUqRWBbifgYMo4e6o7IKwwpWdk3', 'https://astar-livesearch.vercel.app/check-route?data=MTIzNDU2Nzg5MDEyMzQ1Ngs9K5iUeIQoiEH7DzQcVA2LNA7NWiCha-z87AIwAoil', 'https://astar-livesearch.vercel.app/check-route?data=MTIzNDU2Nzg5MDEyMzQ1NpqvzNx6Vj-GBEvoOmEX55ThOXKHNA4DnVn7sArWXD1h', 'https://astar-livesearch.vercel.app/check-route?data=MTIzNDU2Nzg5MDEyMzQ1NoIoOz-oZ4cfDBoGtyUoIbMG63JWM0zyEqtS6l-5NTda', 'https://astar-livesearch.vercel.app/check-route?data=MTIzNDU2Nzg5MDEyMzQ1NtjGqFLK6rDb7YZDHLnt35uLRUHPD0VTisAPYbTh9aHI', 'https://astar-livesearch.vercel.app/check-route?data=MTIzNDU2Nzg5MDEyMzQ1Nq-ZRNvTGEs3Uh9aGbgSEtOPV2_Jp9aXLpSpAsSocxMf', 'https://astar-livesearch.vercel.app/check-route?data=MTIzNDU2Nzg5MDEyMzQ1NpHxbSCJVndswr3Q2Ca12KfwuBgBU1qhNgw7Di5yA1uv', 'https://astar-livesearch.vercel.app/check-route?data=MTIzNDU2Nzg5MDEyMzQ1Nl-7A0scc1CRuFlhTnpjJScNUZqWy629BL7beDkuzdOX', 'https://astar-livesearch.vercel.app/check-route?data=MTIzNDU2Nzg5MDEyMzQ1NtQRD4n44wM-k2vJaAGHl5k2_Hecrvjr2QlneCD5DK0o', 'https://astar-livesearch.vercel.app/check-route?data=MTIzNDU2Nzg5MDEyMzQ1NuOkiHQxcbkoSRmmVlaAZRNKt12y4iU4D6Rxr36lvJ9-', 'https://astar-livesearch.vercel.app/check-route?data=MTIzNDU2Nzg5MDEyMzQ1NrgYJQRnnEKOfO_u0XUqRWCOoOSqRlAMS8Fb_C2alm9H', 'https://astar-livesearch.vercel.app/check-route?data=MTIzNDU2Nzg5MDEyMzQ1Ngs9K5iUeIQoiEH7DzQcVA1o-0c7_jXFd1vx1abq-etf', 'https://astar-livesearch.vercel.app/check-route?data=MTIzNDU2Nzg5MDEyMzQ1NpqvzNx6Vj-GBEvoOmEX55SJjkhtKSSCyTYXNP8qVWgp', 'https://astar-livesearch.vercel.app/check-route?data=MTIzNDU2Nzg5MDEyMzQ1NoIoOz-oZ4cfDBoGtyUoIbMPgF9i4NteerrTQe7Ma0uN', 'https://astar-livesearch.vercel.app/check-route?data=MTIzNDU2Nzg5MDEyMzQ1NtjGqFLK6rDb7YZDHLnt35sLPiFdkSYhPdsGhNWe-BuL', 'https://astar-livesearch.vercel.app/check-route?data=MTIzNDU2Nzg5MDEyMzQ1Nq-ZRNvTGEs3Uh9aGbgSEtM2EpyPVdwIyLu6ujpuHxgo', 'https://astar-livesearch.vercel.app/check-route?data=MTIzNDU2Nzg5MDEyMzQ1NpHxbSCJVndswr3Q2Ca12KcOkNxMiwNFLNJsV8v5338Z', 'https://astar-livesearch.vercel.app/check-route?data=MTIzNDU2Nzg5MDEyMzQ1Nl-7A0scc1CRuFlhTnpjJSdMiDeHuSbwDMCBw_hz-bug', 'https://astar-livesearch.vercel.app/check-route?data=MTIzNDU2Nzg5MDEyMzQ1NtQRD4n44wM-k2vJaAGHl5kJb1uOb7Nk3-24v7LV2X59', 'https://astar-livesearch.vercel.app/check-route?data=MTIzNDU2Nzg5MDEyMzQ1NuOkiHQxcbkoSRmmVlaAZRO8RAHyRYY8tcCUibuDVhr7', 'https://astar-livesearch.vercel.app/check-route?data=MTIzNDU2Nzg5MDEyMzQ1NrgYJQRnnEKOfO_u0XUqRWAzQxn2Vn4qSFfzPaUPo1VT', 'https://astar-livesearch.vercel.app/check-route?data=MTIzNDU2Nzg5MDEyMzQ1Ngs9K5iUeIQoiEH7DzQcVA29BCbLQic9TovHQxujDqpU', 'https://astar-livesearch.vercel.app/check-route?data=MTIzNDU2Nzg5MDEyMzQ1NpqvzNx6Vj-GBEvoOmEX55TzkDA80y7Ea1zJ3xD9sjA6', 'https://astar-livesearch.vercel.app/check-route?data=MTIzNDU2Nzg5MDEyMzQ1NoIoOz-oZ4cfDBoGtyUoIbM4IwtyijttK_Cw9VxXTkd0'] 
    
    print(f"Starting URL testing of {len(urls)} URLs...")
    print("-" * 50)
    
    failed_tests = []
    passed_count = 0
    
    for url in urls:
        success, message = test_url_decryption(url)
        
        if success:
            passed_count += 1
            print(f"✅ Test passed for URL: {url[:100]}...")
        else:
            failed_tests.append((url, message))
            print(f"❌ Test failed for URL: {url[:100]}...")
            print(f"   Error: {message}")
        
        # Small delay between tests
        time.sleep(0.1)
    
    print("\nTest Results Summary")
    print("-" * 50)
    print(f"Total URLs tested: {len(urls)}")
    print(f"Passed: {passed_count}")
    print(f"Failed: {len(failed_tests)}")
    
    if failed_tests:
        print("\nFailed Test Details:")
        for url, message in failed_tests:
            print(f"\nURL: {url[:100]}...")
            print(f"Error: {message}")

if __name__ == "__main__":
    run_url_tests()