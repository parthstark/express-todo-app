const colors = {
    reset: '\x1b[0m',
    yellow: '\x1b[33m',
};

const colorize = (text, color) => `${colors[color]}${text}${colors.reset}`;

module.exports = colorize