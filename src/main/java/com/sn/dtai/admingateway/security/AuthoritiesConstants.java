package com.sn.dtai.admingateway.security;

/**
 * Constants for Spring Security authorities.
 */
public final class AuthoritiesConstants {

    public static final String ADMIN = "ROLE_ADMIN";

    public static final String USER = "ROLE_USER";

    public static final String USEROPERATEUR = "ROLE_OPERATEUR";

    public static final String USERDIRECTEUR = "ROLE_DIRECTEUR";

    public static final String ANONYMOUS = "ROLE_ANONYMOUS";

    private AuthoritiesConstants() {}
}
