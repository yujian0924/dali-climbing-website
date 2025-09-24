import { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@store/index';
import { debounce } from '@utils/index';

// Redux hooks
export * from './redux';
// 移除重复的useAuth导出，因为它已经在下面定义了

// 本地存储hook
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

// 防抖hook
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// 防抖回调hook
export const useDebouncedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList
): T => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useCallback(
    debounce((...args: Parameters<T>) => callbackRef.current(...args), delay),
    [delay, ...deps]
  ) as T;
};

// 窗口尺寸hook
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

// 媒体查询hook
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(() => {
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handleChange = () => setMatches(mediaQuery.matches);
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
};

// 响应式设计hook
export const useResponsive = () => {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    device: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'
  };
};

// 滚动位置hook
export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState({
    x: window.pageXOffset,
    y: window.pageYOffset,
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition({
        x: window.pageXOffset,
        y: window.pageYOffset,
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollPosition;
};

// 元素可见性hook
export const useIntersectionObserver = (
  elementRef: React.RefObject<Element>,
  options?: IntersectionObserverInit
): boolean => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      options
    );

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [elementRef, options]);

  return isVisible;
};

// 异步状态hook
export const useAsync = <T, E = string>(
  asyncFunction: () => Promise<T>,
  immediate = true
) => {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>(
    'idle'
  );
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  const execute = useCallback(() => {
    setStatus('pending');
    setData(null);
    setError(null);

    return asyncFunction()
      .then((response: T) => {
        setData(response);
        setStatus('success');
        return response;
      })
      .catch((error: E) => {
        setError(error);
        setStatus('error');
        throw error;
      });
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    execute,
    status,
    data,
    error,
    isIdle: status === 'idle',
    isPending: status === 'pending',
    isSuccess: status === 'success',
    isError: status === 'error',
  };
};

// 表单hook
export const useForm = <T extends Record<string, any>>(
  initialValues: T,
  validationRules?: Partial<Record<keyof T, (value: any) => string | null>>
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const setValue = (name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // 验证字段
    if (validationRules && validationRules[name]) {
      const error = validationRules[name]!(value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const setFieldTouched = (name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleChange = (name: keyof T) => (value: any) => {
    setValue(name, value);
  };

  const handleBlur = (name: keyof T) => () => {
    setFieldTouched(name);
  };

  const validate = (): boolean => {
    if (!validationRules) return true;
    
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(validationRules).forEach(key => {
      const fieldName = key as keyof T;
      const validator = validationRules[fieldName];
      if (validator) {
        const error = validator(values[fieldName]);
        if (error) {
          newErrors[fieldName] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    setValue,
    setTouched: setFieldTouched,
    handleChange,
    handleBlur,
    validate,
    reset,
    isValid: Object.keys(errors).length === 0,
  };
};

// 分页hook
export const usePagination = (
  totalItems: number,
  itemsPerPage: number = 10,
  initialPage: number = 1
) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const goToFirstPage = () => {
    setCurrentPage(1);
  };
  
  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };
  
  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
};

// 认证状态hook
export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  return {
    user,
    isAuthenticated,
    loading,
    error,
    dispatch,
  };
};

// 地理位置hook
export const useGeolocation = () => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('浏览器不支持地理位置功能');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
      },
      (error) => {
        setError('获取位置失败：' + error.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5分钟缓存
      }
    );
  }, []);

  return {
    location,
    error,
    loading,
    getCurrentLocation,
  };
};

// 文件上传hook
export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(async (
    file: File,
    uploadFunction: (file: File, onProgress?: (progress: number) => void) => Promise<any>
  ) => {
    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const result = await uploadFunction(file, setProgress);
      setUploading(false);
      setProgress(100);
      return result;
    } catch (error: any) {
      setUploading(false);
      setError(error.message || '上传失败');
      throw error;
    }
  }, []);

  return {
    uploading,
    progress,
    error,
    uploadFile,
  };
};

// 搜索hook
export const useSearch = <T>(
  searchFunction: (query: string) => Promise<T[]>,
  delay: number = 300
) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, delay);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    const search = async () => {
      setLoading(true);
      setError(null);

      try {
        const searchResults = await searchFunction(debouncedQuery);
        setResults(searchResults);
      } catch (error: any) {
        setError(error.message || '搜索失败');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    search();
  }, [debouncedQuery, searchFunction]);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
  };
};

// 复制到剪贴板hook
export const useClipboard = () => {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch (error) {
      console.error('复制失败:', error);
      return false;
    }
  }, []);

  return { copied, copy };
};

// 定时器hook
export const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const tick = () => savedCallback.current();
    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
};

// 组件挂载状态hook
export const useIsMounted = () => {
  const isMountedRef = useRef(true);
  
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  return useCallback(() => isMountedRef.current, []);
};