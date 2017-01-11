precision highp float;
precision highp int;

varying vec2 vUv;

uniform sampler2D tMain;
uniform int uRadius;
uniform vec2 uResolution;

#define CNT 4

void main(){
    float radiusSquare =  (1.0 + float(RAD) ) * (1.0 + float(RAD) );
    vec3 colors[CNT]; //= vec3(0.);
    vec3 colorSquares[CNT];

    for(int ii = 0; ii < CNT; ii++){
        colors[ii] = vec3(0.0);
        colorSquares[ii] = vec3(0.0);
    }


    for(int j = -RAD; j <= 0; j++){
        for(int i = -RAD; i <= 0; i++){
            vec3 col = texture2D(tMain, vUv + vec2(i, j)/uResolution).rgb;
            colors[0] += col;
            colorSquares[0] += col * col;
        }
    }

    for(int j = -RAD; j <= 0; j++){
        for(int i = 0; i <= RAD; i++){
            vec3 col = texture2D(tMain, vUv + vec2(i, j)/uResolution).rgb;
            colors[1] += col;
            colorSquares[1] += col * col;
        }
    }

    for(int j = 0; j <= RAD; j++){
        for(int i = -RAD; i <= 0; i++){
            vec3 col = texture2D(tMain, vUv + vec2(i, j)/uResolution).rgb;
            colors[2] += col;
            colorSquares[2] += col * col;
        }
    }

    for(int j = 0; j <= RAD; j++){
        for(int i = 0; i <= RAD; i++){
            vec3 col = texture2D(tMain, vUv + vec2(i, j)/uResolution).rgb;
            colors[3] += col;
            colorSquares[3] += col * col;
        }
    }

    float   lMinSigma = 4.71828182846;

     vec3 outColor = vec3(0.);

     for (int i = 0; i < 4; i++){
        colors[i] /= radiusSquare;
        colorSquares[i] = abs( colorSquares[i] / radiusSquare - colors[i] * colors[i]);
        float   lSigma = colorSquares[i].r + colorSquares[i].g + colorSquares[i].b;
        if (lSigma < lMinSigma)
        {
            lMinSigma = lSigma;
            outColor = colors[i];
        }
    }

    gl_FragColor = vec4(outColor, 1.0);

}
