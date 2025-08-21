#!/usr/bin/env python3
"""
Backend Testing Script for RefereeCourt Pro
Tests the FastAPI backend server endpoints and functionality
"""

import requests
import json
import sys
import os
from typing import Dict, Any

# Get the backend URL from frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=')[1].strip()
    except FileNotFoundError:
        pass
    return 'http://localhost:8001'

BACKEND_URL = get_backend_url()
API_BASE_URL = f"{BACKEND_URL}/api"

class BackendTester:
    def __init__(self):
        self.results = {
            'total_tests': 0,
            'passed_tests': 0,
            'failed_tests': 0,
            'test_details': []
        }
    
    def log_test(self, test_name: str, passed: bool, details: str = ""):
        """Log test result"""
        self.results['total_tests'] += 1
        if passed:
            self.results['passed_tests'] += 1
            status = "✅ PASS"
        else:
            self.results['failed_tests'] += 1
            status = "❌ FAIL"
        
        result = {
            'test': test_name,
            'status': status,
            'details': details
        }
        self.results['test_details'].append(result)
        print(f"{status}: {test_name}")
        if details:
            print(f"   Details: {details}")
    
    def test_server_connectivity(self):
        """Test if the backend server is reachable"""
        try:
            response = requests.get(BACKEND_URL, timeout=5)
            if response.status_code == 200:
                self.log_test("Server Connectivity", True, f"Server responding on {BACKEND_URL}")
                return True
            else:
                self.log_test("Server Connectivity", False, f"Server returned status {response.status_code}")
                return False
        except requests.exceptions.RequestException as e:
            self.log_test("Server Connectivity", False, f"Connection failed: {str(e)}")
            return False
    
    def test_root_endpoint(self):
        """Test the root endpoint"""
        try:
            response = requests.get(BACKEND_URL, timeout=5)
            if response.status_code == 200:
                data = response.json()
                if 'message' in data and 'RefereeCourt Pro Backend' in data['message']:
                    self.log_test("Root Endpoint", True, f"Response: {data}")
                    return True
                else:
                    self.log_test("Root Endpoint", False, f"Unexpected response: {data}")
                    return False
            else:
                self.log_test("Root Endpoint", False, f"Status code: {response.status_code}")
                return False
        except requests.exceptions.RequestException as e:
            self.log_test("Root Endpoint", False, f"Request failed: {str(e)}")
            return False
    
    def test_health_endpoint(self):
        """Test the health check endpoint"""
        try:
            response = requests.get(f"{API_BASE_URL}/health", timeout=5)
            if response.status_code == 200:
                data = response.json()
                if 'status' in data and data['status'] == 'healthy':
                    self.log_test("Health Endpoint", True, f"Response: {data}")
                    return True
                else:
                    self.log_test("Health Endpoint", False, f"Unexpected response: {data}")
                    return False
            else:
                self.log_test("Health Endpoint", False, f"Status code: {response.status_code}")
                return False
        except requests.exceptions.RequestException as e:
            self.log_test("Health Endpoint", False, f"Request failed: {str(e)}")
            return False
    
    def test_cors_headers(self):
        """Test CORS headers are present"""
        try:
            response = requests.options(f"{API_BASE_URL}/health", timeout=5)
            headers = response.headers
            
            cors_headers_present = (
                'Access-Control-Allow-Origin' in headers or
                'access-control-allow-origin' in headers
            )
            
            if cors_headers_present:
                self.log_test("CORS Headers", True, "CORS headers are configured")
                return True
            else:
                # Try a GET request to check CORS headers
                response = requests.get(f"{API_BASE_URL}/health", timeout=5)
                headers = response.headers
                cors_headers_present = (
                    'Access-Control-Allow-Origin' in headers or
                    'access-control-allow-origin' in headers
                )
                
                if cors_headers_present:
                    self.log_test("CORS Headers", True, "CORS headers are configured")
                    return True
                else:
                    self.log_test("CORS Headers", False, "CORS headers not found")
                    return False
        except requests.exceptions.RequestException as e:
            self.log_test("CORS Headers", False, f"Request failed: {str(e)}")
            return False
    
    def test_invalid_endpoint(self):
        """Test handling of invalid endpoints"""
        try:
            response = requests.get(f"{API_BASE_URL}/nonexistent", timeout=5)
            if response.status_code == 404:
                self.log_test("Invalid Endpoint Handling", True, "Returns 404 for invalid endpoints")
                return True
            else:
                self.log_test("Invalid Endpoint Handling", False, f"Expected 404, got {response.status_code}")
                return False
        except requests.exceptions.RequestException as e:
            self.log_test("Invalid Endpoint Handling", False, f"Request failed: {str(e)}")
            return False
    
    def test_server_response_time(self):
        """Test server response time"""
        try:
            import time
            start_time = time.time()
            response = requests.get(f"{API_BASE_URL}/health", timeout=5)
            end_time = time.time()
            
            response_time = (end_time - start_time) * 1000  # Convert to milliseconds
            
            if response.status_code == 200 and response_time < 1000:  # Less than 1 second
                self.log_test("Response Time", True, f"Response time: {response_time:.2f}ms")
                return True
            elif response.status_code == 200:
                self.log_test("Response Time", False, f"Slow response time: {response_time:.2f}ms")
                return False
            else:
                self.log_test("Response Time", False, f"Request failed with status {response.status_code}")
                return False
        except requests.exceptions.RequestException as e:
            self.log_test("Response Time", False, f"Request failed: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all backend tests"""
        print(f"🚀 Starting Backend Tests for RefereeCourt Pro")
        print(f"Backend URL: {BACKEND_URL}")
        print(f"API Base URL: {API_BASE_URL}")
        print("=" * 60)
        
        # Test server connectivity first
        if not self.test_server_connectivity():
            print("\n❌ Server is not reachable. Stopping tests.")
            return self.results
        
        # Run all tests
        self.test_root_endpoint()
        self.test_health_endpoint()
        self.test_cors_headers()
        self.test_invalid_endpoint()
        self.test_server_response_time()
        
        return self.results
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {self.results['total_tests']}")
        print(f"Passed: {self.results['passed_tests']}")
        print(f"Failed: {self.results['failed_tests']}")
        
        if self.results['failed_tests'] == 0:
            print("\n🎉 All tests passed! Backend is working correctly.")
        else:
            print(f"\n⚠️  {self.results['failed_tests']} test(s) failed.")
            print("\nFailed tests:")
            for test in self.results['test_details']:
                if "❌" in test['status']:
                    print(f"  - {test['test']}: {test['details']}")
        
        return self.results['failed_tests'] == 0

def main():
    """Main function to run backend tests"""
    tester = BackendTester()
    results = tester.run_all_tests()
    success = tester.print_summary()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()