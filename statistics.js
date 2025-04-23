// 网站访问统计代码
(function() {
    // 访问统计信息
    var visitStats = {
        pageViews: 0,
        visitors: 0,
        deviceInfo: {},
        referrers: {}
    };

    // 获取设备信息
    function getDeviceInfo() {
        var ua = navigator.userAgent;
        var device = {
            browser: '',
            os: '',
            device: ''
        };

        // 浏览器检测
        if (ua.indexOf('Chrome') > -1) {
            device.browser = 'Chrome';
        } else if (ua.indexOf('Firefox') > -1) {
            device.browser = 'Firefox';
        } else if (ua.indexOf('Safari') > -1) {
            device.browser = 'Safari';
        } else if (ua.indexOf('MSIE') > -1 || ua.indexOf('Trident/') > -1) {
            device.browser = 'IE';
        } else if (ua.indexOf('Edge') > -1) {
            device.browser = 'Edge';
        } else {
            device.browser = 'Other';
        }

        // 操作系统检测
        if (ua.indexOf('Windows') > -1) {
            device.os = 'Windows';
        } else if (ua.indexOf('Mac') > -1) {
            device.os = 'Mac';
        } else if (ua.indexOf('Linux') > -1) {
            device.os = 'Linux';
        } else if (ua.indexOf('Android') > -1) {
            device.os = 'Android';
        } else if (ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1) {
            device.os = 'iOS';
        } else {
            device.os = 'Other';
        }

        // 设备类型检测
        if (ua.indexOf('Mobile') > -1) {
            device.device = 'Mobile';
        } else if (ua.indexOf('Tablet') > -1) {
            device.device = 'Tablet';
        } else {
            device.device = 'Desktop';
        }

        return device;
    }

    // 记录当前页面访问
    function recordPageView() {
        visitStats.pageViews++;
        
        // 获取来源页面
        var referrer = document.referrer;
        if (referrer && referrer !== '') {
            if (visitStats.referrers[referrer]) {
                visitStats.referrers[referrer]++;
            } else {
                visitStats.referrers[referrer] = 1;
            }
        }

        // 获取设备信息
        var deviceInfo = getDeviceInfo();
        visitStats.deviceInfo = deviceInfo;

        // 这里可以发送数据到服务器保存
        console.log('Page view recorded:', visitStats);

        // 假设我们把数据存在localStorage中
        localStorage.setItem('visitStats', JSON.stringify(visitStats));
    }

    // 页面加载完成时记录访问信息
    window.addEventListener('load', function() {
        // 检查是否是新访客
        if (!localStorage.getItem('visited')) {
            visitStats.visitors++;
            localStorage.setItem('visited', 'true');
        }

        // 尝试从localStorage中恢复之前的统计数据
        var savedStats = localStorage.getItem('visitStats');
        if (savedStats) {
            try {
                var parsedStats = JSON.parse(savedStats);
                visitStats.pageViews = parsedStats.pageViews;
                visitStats.visitors = parsedStats.visitors;
                visitStats.referrers = parsedStats.referrers || {};
            } catch (e) {
                console.error('Error parsing saved stats:', e);
            }
        }

        recordPageView();
    });

    // 提供访问统计信息的接口
    window.getVisitStats = function() {
        return JSON.parse(JSON.stringify(visitStats)); // 返回副本避免外部修改
    };
})(); 