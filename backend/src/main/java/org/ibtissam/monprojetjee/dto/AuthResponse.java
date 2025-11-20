package org.ibtissam.monprojetjee.dto;



import org.ibtissam.monprojetjee.models.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private User user;
}